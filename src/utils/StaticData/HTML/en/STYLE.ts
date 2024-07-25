export const STYLE = ` <style>
        html {
            color: #222222;
            font-size: 1em;
            line-height: 1.4;
        }
        body {
            margin: 0;
            padding: 0;
            color: #222222;
        }
        ::-moz-selection {
            background: #b3d4fc;
            text-shadow: none;
        }

        ::selection {
            background: #b3d4fc;
            text-shadow: none;
        }
        hr {
            display: block;
            height: 1px;
            border: 0;
            border-top: 1px solid #ccc;
            margin: 1em 0;
            padding: 0;
        }

        audio,
        canvas,
        iframe,
        img,
        svg,
        video {
            vertical-align: middle;
        }

        fieldset {
            border: 0;
            margin: 0;
            padding: 0;
        }

        textarea {
            resize: vertical;
        }

        .browserupgrade {
            margin: 0.2em 0;
            background: #ccc;
            color: #000;
            padding: 0.2em 0;
        }

        h1 {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 24px;
            color: #ffffff;
            font-weight: 200;
        }

        h2 {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 24px;
            font-weight: 500;
        }

        h3 {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 16px;
            margin: 40px 0 10px 0;
        }

        p {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 16px;
        }

        ol,
        li {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 500;
            margin-top: 20px;
        }

        footer {
            font-family: Gotham Narrow A, Gotham Narrow B, Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 12px;
        }

        a:link,
        a:visited {
            color: #006bb6;
            text-decoration: none;
        }

        a:hover,
        a:active {
            color: #003e6a;
        }


        .note {
            color: #7c8085;
        }

        .feature {
            height: 200px;
            background-color: rgb(0, 107, 182);
        }

        .feature-txt {
            text-align: center;
            padding-top: 80px;
        }

        .contact {
            padding: 30px;
        }

        .documents {
            padding: 30px;
        }

        .faqs {
            padding: 30px;
        }

        .eula {
            padding: 30px;
        }

        .terms {
            padding: 30px;
        }

        .cleaning {
            padding: 30px;
        }

        .parts-sheets {
            padding: 30px;
        }

        .parts-sheets-links {
            display: flex;
            flex-wrap: wrap;
            margin: 60px -15px;
        }

        .parts-sheet-link {
            width: calc(100% - 30px);
            margin-bottom: 30px;
            padding: 0 15px;
        }

        @media (min-width: 700px) {
            .parts-sheet-link {
                width: calc(50% - 30px);
            }
        }

        @media (min-width: 900px) {
            .parts-sheet-link {
                width: calc(33.333% - 30px);
            }
        }

        @media (min-width: 1200px) {
            .parts-sheet-link {
                width: calc(25% - 30px);
            }
        }

        .parts-sheet-link img {
            width: 100%;
        }

        .hidden {
            display: none !important;
        }

        .visuallyhidden {
            border: 0;
            clip: rect(0 0 0 0);
            -webkit-clip-path: inset(50%);
            clip-path: inset(50%);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
            white-space: nowrap;
            /* 1 */
        }

        /*
 * Extends the .visuallyhidden class to allow the element
 * to be focusable when navigated to via the keyboard:
 * https://www.drupal.org/node/897638
 */

        .visuallyhidden.focusable:active,
        .visuallyhidden.focusable:focus {
            clip: auto;
            -webkit-clip-path: none;
            clip-path: none;
            height: auto;
            margin: 0;
            overflow: visible;
            position: static;
            width: auto;
            white-space: inherit;
        }
        .invisible {
            visibility: hidden;
        }

        .clearfix:before,
        .clearfix:after {
            content: " ";
            display: table;
        }

        .clearfix:after {
            clear: both;
        }

        @media only screen and (min-width: 35em) {
        }

        @media print,
        (-webkit-min-device-pixel-ratio: 1.25),
        (min-resolution: 1.25dppx),
        (min-resolution: 120dpi) {
        }
    </style>`;