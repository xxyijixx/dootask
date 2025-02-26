<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta name="format-detection" content="telephone=no" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $system_alias }} - v{{ $version }}</title>
    <link rel="shortcut icon" href="{{ asset_main('favicon.ico') }}">
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 14px;
            color: #555;
        }

        .mirror {
            overflow: auto;
            max-width: 1180px;
            margin: 0 auto 20px;
            padding: 0 20px;
        }

        .mirror-nav {
            max-width: 1180px;
            margin: 20px auto 10px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 20px;
            font-size: 12pt
        }

        td, th {
            text-align: left;
        }

        td {
            padding: 4px 8px;
            border-top: 0;
            word-break: break-all
        }

        td a {
            color: #1890ff;
        }

        a {
            text-decoration: none;
        }

        a:link {
            color: #088acb
        }

        thead tr {
            height: 44px;
            border-bottom: 1px solid rgba(61, 61, 61, .1)
        }

        tbody tr:hover {
            background-color: #e0f3fc
        }

        tbody tr:first-child:hover {
            background-color: inherit;
        }

        tbody tr:first-child td {
            height: 6px;
            padding: 0;
        }

        .fileName {
            position: relative;
        }

        .download-other-btn {
            flex-shrink: 0;
            padding: 2px 12px;
            color: #088acb;
            border-radius: 8px;
            margin-top: 2px;
            margin-left: 12px;
            border: 1px solid #088acb;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .fileDate, .fileName, .fileSize {
            padding-left: 8px;
            line-height: 44px;
        }

        .date, .link, .size {
            line-height: 26px
        }

        .fileDate,
        .date {
            width: 25%;
        }

        .fileName,
        .link {
            width: 55%;
        }

        .fileSize,
        .size {
            width: 20%;
        }

        .other-version {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            font-size: 11pt;
            padding: 0 24px;
        }
        .other-version a {
            padding: 0 12px;
            color: #088acb
        }

        @media (max-width: 768px) {
            .mirror {
                width: 100%;
                padding: 0 15px 10px
            }

            .mirror, tbody {
                overflow: auto
            }

            tr {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex
            }

            td {
                padding: 4px 8px;
                border-top: 0;
                white-space: nowrap;
                overflow: auto
            }

            .fileName, .link {
                min-width: 280px;
                width: 55%
            }

            .date, .fileDate {
                min-width: 190px;
                width: 25%
            }

            .fileSize, .size {
                min-width: 150px;
                width: 20%
            }

            .fileSize {
                margin-right: 10px
            }

            .fileSize a {
                display: block;
                white-space: nowrap
            }

            a:hover {
                color: #ff791a
            }
        }
    </style>
</head>

<body>
@extends('ie')

<h1 class="mirror-nav">
    <span>Download of v{{ $version }}{{ $version === $latest_version ? ' (Latest)' : '' }}{{ $is_draft ? ' (Draft)' : '' }}</span>
    <a class="download-other-btn" href="https://github.com/kuaifan/dootask/releases" target="_blank">More Versions</a>
</h1>
<div class="mirror">
    <table class="table">
        <thead>
        <tr>
            <th class="fileName">File Name</th>
            <th class="fileSize">File Size</th>
            <th class="fileDate">Date</th>
        </tr>
        </thead>

        <tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        @forelse($files as $file)
            <tr>
                <td class="link"><a href="{{ $file['url'] }}">{{ $file['name'] }}</a></td>
                <td class="size">{{ $file['size'] }}</td>
                <td class="date">{{ $file['time'] }}</td>
            </tr>
        @empty
            <tr>
                <td>List is empty</td>
                <td></td>
                <td></td>
            </tr>
        @endforelse
        </tbody>
    </table>
</div>
@if ($other_version)
    <div class="other-version">
        @foreach($other_version as $item)
            <a href="{{ $item['url'] }}">v{{ $item['version'] }}{{ $item['version'] === $latest_version ? ' (Latest)' : '' }}</a>
        @endforeach
    </div>
@endif
</body>
<script>
    function getUrlParam(name, url) {
        let qs = arguments[1] || window.location.href,
            reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = qs.substring(qs.indexOf("?") + 1).match(reg);
        if (r !== null) {
            let i = decodeURI(r[2]).indexOf('#');
            if (i !== -1) {
                return decodeURI(r[2]).substring(0, i);
            } else {
                return decodeURI(r[2]);
            }
        } else {
            return '';
        }
    }
    let platform = getUrlParam('platform');
    if (platform) {
        let arch = getUrlParam('arch');
        if (arch) {
            platform = platform + '-' + arch;
        }
        let reg = new RegExp(`-${platform.toLowerCase()}\.(apk|dmg|exe)$`)
        document.querySelectorAll("tr").forEach(function (item) {
            let e = item.querySelector("a")
            if (e && reg.test(e.href)) {
                item.style.fontWeight = 'bold'
                e.click()
            } else {
                item.style.fontWeight = 'normal'
            }
        });
    }
</script>
</html>
