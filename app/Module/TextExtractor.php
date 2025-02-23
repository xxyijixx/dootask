<?php

namespace App\Module;

use Exception;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser;

class TextExtractor
{
    /**
     * 从文件中提取文本
     *
     * @param string $filePath 文件路径
     * @return string
     * @throws Exception
     */
    public function extractText(string $filePath): string
    {
        if (!file_exists($filePath)) {
            throw new Exception("文件不存在: {$filePath}");
        }

        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        try {
            return match($fileExtension) {
                'pdf'   => $this->extractFromPDF($filePath),
                'docx'  => $this->extractFromDOCX($filePath),
                'ipynb' => $this->extractFromIPYNB($filePath),
                default => $this->extractFromOtherFile($filePath),
            };
        } catch (Exception $e) {
            Log::error('文本提取失败', [
                'file' => $filePath,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * 从PDF文件中提取文本
     *
     * @param string $filePath
     * @return string
     * @throws Exception
     */
    protected function extractFromPDF(string $filePath): string
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($filePath);

            return $pdf->getText();
        } catch (Exception $e) {
            Log::error('PDF解析失败', [
                'file' => $filePath,
                'error' => $e->getMessage()
            ]);
            throw new Exception("PDF文本提取失败: " . $e->getMessage());
        }
    }

    /**
     * 从DOCX文件中提取文本
     *
     * @param string $filePath
     * @return string
     * @throws Exception
     */
    protected function extractFromDOCX(string $filePath): string
    {
        $phpWord = IOFactory::load($filePath);
        $text = '';

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if (method_exists($element, 'getText')) {
                    $text .= $element->getText() . "\n";
                }
            }
        }

        return $text;
    }

    /**
     * 从Jupyter Notebook文件中提取文本
     *
     * @param string $filePath
     * @return string
     * @throws Exception
     */
    protected function extractFromIPYNB(string $filePath): string
    {
        $content = file_get_contents($filePath);
        $notebook = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("IPYNB文件解析失败: " . json_last_error_msg());
        }

        $extractedText = '';

        foreach ($notebook['cells'] ?? [] as $cell) {
            if (in_array($cell['cell_type'] ?? '', ['markdown', 'code']) && isset($cell['source'])) {
                $source = $cell['source'];
                $extractedText .= is_array($source)
                    ? implode("\n", $source)
                    : $source;
                $extractedText .= "\n";
            }
        }

        return $extractedText;
    }

    /**
     * 从其他类型文件中提取文本
     *
     * @param string $filePath
     * @return string
     * @throws Exception
     */
    protected function extractFromOtherFile(string $filePath): string
    {
        if ($this->isBinaryFile($filePath)) {
            throw new Exception("无法读取该类型文件的文本内容");
        }

        return file_get_contents($filePath);
    }

    /**
     * 检查文件是否为二进制文件
     *
     * @param string $filePath
     * @return bool
     */
    protected function isBinaryFile(string $filePath): bool
    {
        $finfo = finfo_open(FILEINFO_MIME);
        $mimeType = finfo_file($finfo, $filePath);
        finfo_close($finfo);

        return !str_contains($mimeType, 'text/')
            && !str_contains($mimeType, 'application/json')
            && !str_contains($mimeType, 'application/xml');
    }

    /** ********************************************************************* */
    /** ********************************************************************* */
    /** ********************************************************************* */

    /**
     * 获取文件内容
     * @param $filePath
     * @return string
     */
    public static function getFileContent($filePath)
    {
        if (!file_exists($filePath) || !is_file($filePath)) {
            return "(Failed to read contents of {$filePath})";
        }
        $te = new self();
        try {
            $isBinary = $te->isBinaryFile($filePath);
            if ($isBinary) {
                return "(Binary file, unable to display content)";
            }
            return $te->extractText($filePath);
        } catch (Exception $e) {
            return "(Failed to read contents of {$filePath}: {$e->getMessage()})";
        }
    }
}
