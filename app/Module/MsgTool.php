<?php

namespace App\Module;


use DOMDocument;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Exception\CommonMarkException;
use League\HTMLToMarkdown\HtmlConverter;

class MsgTool
{
    /**
     * 截取文本并保持标签完整性
     *
     * @param string $text 要截取的文本
     * @param int $length 截取长度
     * @param string $type 文本类型 (htm 或 md)
     * @return string 处理后的文本
     */
    public static function truncateText($text, $length, $type = 'htm')
    {
        if (empty($text) || mb_strlen($text) <= $length) {
            return $text;
        }

        $isMd = strtolower($type) === 'md';
        $placeholders = [];

        // 如果是Markdown，先处理特殊标记及转换为HTML
        if ($isMd) {
            // 处理特殊标记
            $pattern = '/:::\s*reasoning\s+(.*?)\s*:::/s';
            $counter = 0;
            $text = preg_replace_callback($pattern, function($matches) use ($type, $length, &$placeholders, &$counter) {
                // 使用更简短的占位符，避免被markdown解析
                $placeholder = "@PH::{$counter}::PH@";
                $placeholders[$placeholder] = "::: reasoning\n" . self::truncateText($matches[1], $length, $type) . "\n:::";
                $counter++;
                return $placeholder;
            }, $text);
            // 转换为HTML
            try {
                $converter = new CommonMarkConverter();
                $text = $converter->convert($text);
            } catch (CommonMarkException) {
                return "";
            }
        }

        // 创建DOM文档
        $dom = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $dom->loadHTML(mb_convert_encoding($text, 'HTML-ENTITIES', 'UTF-8'));
        libxml_clear_errors();

        // 获取body元素
        $body = $dom->getElementsByTagName('body')->item(0);
        $truncatedHtml = '';
        $currentLength = 0;

        // 递归函数来遍历节点并截取内容
        self::traverseNodes($body, $currentLength, $length, $truncatedHtml);

        // 如果是Markdown，转换回Markdown及还原特殊标记
        if ($isMd) {
            // 转换回Markdown
            try {
                $converter = new HtmlConverter();
                $truncatedHtml = $converter->convert($truncatedHtml);
            } catch (\Exception) {
                return "";
            }
            // 还原特殊标记
            if (!empty($placeholders)) {
                $truncatedHtml = preg_replace('/@P?H?:*\s*$/', '', $truncatedHtml);
                $preCount = substr_count($truncatedHtml, '@PH::');
                $sufCount = substr_count($truncatedHtml, '::PH@');
                $diffCount = $preCount - $sufCount;
                if ($diffCount > 0) {
                    $truncatedHtml .= str_repeat('::PH@', $diffCount);
                }
                $truncatedHtml = strtr($truncatedHtml, $placeholders);
            }
        }

        return $truncatedHtml;
    }

    /**
     * 递归遍历节点
     * @param $node
     * @param $currentLength
     * @param $length
     * @param $truncatedHtml
     * @return void
     */
    private static function traverseNodes($node, &$currentLength, $length, &$truncatedHtml)
    {
        foreach ($node->childNodes as $child) {
            if ($currentLength >= $length) {
                break;
            }

            if ($child->nodeType === XML_TEXT_NODE) {
                $textContent = $child->textContent;
                $remainingLength = $length - $currentLength;

                if (mb_strlen($textContent) > $remainingLength) {
                    $truncatedHtml .= htmlspecialchars(mb_substr($textContent, 0, $remainingLength) . '...');
                    $currentLength += $remainingLength;
                } else {
                    $truncatedHtml .= htmlspecialchars($textContent);
                    $currentLength += mb_strlen($textContent);
                }
            } elseif ($child->nodeType === XML_ELEMENT_NODE) {
                $truncatedHtml .= '<' . $child->nodeName;

                // 添加属性
                if ($child->hasAttributes()) {
                    foreach ($child->attributes as $attr) {
                        $truncatedHtml .= ' ' . $attr->nodeName . '="' . htmlspecialchars($attr->nodeValue) . '"';
                    }
                }

                $truncatedHtml .= '>';

                self::traverseNodes($child, $currentLength, $length, $truncatedHtml);

                if ($currentLength < $length || $child->firstChild) {
                    $truncatedHtml .= '</' . $child->nodeName . '>';
                }
            }
        }
    }
}
