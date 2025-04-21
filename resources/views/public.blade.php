@php
    $component = Route::currentRouteName();
@endphp


<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $data['name'] ?? 'Página' }} | {{ env('APP_NAME', 'Stech Perú') }}</title>

    <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ uniqid() }}" type="image/png">
    @isset($data['description'])
        <meta name="description" content="{{ $data['description'] }}">
    @endisset
    @isset($data['keywords'])
        <meta name="keywords" content="{{ implode(', ', $data['keywords']) }}">
    @endisset

    <meta name="author" content="Powered by Manuel Gamboa">

    <link href="/lte/assets/libs/select2/css/select2.min.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet">

    @if ($data['fonts']['title']['url'] && !str_starts_with($data['fonts']['title']['url'], '/'))
        <link rel="stylesheet" href="{{ $data['fonts']['title']['url'] }}">
    @endif

    @if ($data['fonts']['paragraph']['url'] && !str_starts_with($data['fonts']['paragraph']['url'], '/'))
        <link rel="stylesheet" href="{{ $data['fonts']['paragraph']['url'] }}">
    @endif

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead

    @if ($component == 'BlogArticle.jsx')
        <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
        <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />
        <style>
            .ql-editor blockquote {
                border-left: 4px solid #f8b62c;
                padding-left: 16px;
            }

            .ql-editor * {
                /* color: #475569; */
            }

            .ql-editor img {
                border-radius: 8px;
            }
        </style>
    @endif
    <style>
        body {
            /* background-image: url('/assets/img/maqueta/home-mobile.png');*/
            width: 100%;
            height: auto;
            background-size: 100% auto;
            background-repeat: no-repeat;
            /* Asegura que la imagen no se repita */
            background-position: top center;
            /* Centra la imagen en la parte superior */
        }
    </style>
    <style>
        @if ($data['fonts']['title']['name'])
            .font-title {
                font-family: "{{ $data['fonts']['title']['name'] }}", sans-serif;
            }
        @endif
        @if ($data['fonts']['paragraph']['name'])
            * {
                font-family: {{ $data['fonts']['paragraph']['name'] }};
            }
        @endif
        @foreach ($data['colors'] as $color)
            .bg-{{ $color->name }} {
                background-color: {{ $color->description }};
            }

            .customtext-{{ $color->name }} {
                color: {{ $color->description }};
            }

            /* Variantes de hover */
            .hover\:customtext-{{ $color->name }}:hover {
                color: {{ $color->description }};
            }

            .hover\:bg-{{ $color->name }}:hover {
                background-color: {{ $color->description }};

            }

            .placeholder\:customtext-{{ $color->name }}::placeholder {
                color: {{ $color->description }};
            }

            .border-{{ $color->name }} {
                border-color: {{ $color->description }};
            }

            .fill-{{ $color->name }} {
                fill: {{ $color->description }};
            }

            .before\:.bg-{{ $color->name }} {
                background-color: {{ $color->description }};
            }
            .lg\:.bg-{{ $color->name }} {
                background-color: {{ $color->description }};
            }
          
        @endforeach
        .font-emoji {
            font-family: "Noto Color Emoji", sans-serif;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 50%;
            transform: translateY(-50%);
        }
    </style>
</head>

<body class="font-general">
    @inertia

    <!-- Vendor js -->
    <script src="/lte/assets/js/vendor.min.js"></script>

    <script src="/lte/assets/libs/select2/js/select2.full.min.js"></script>
    <!-- App js -->
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"></script>
    <script src="/lte/assets/libs/moment/min/moment.min.js"></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js"></script>
    <script src="/lte/assets/libs/moment/locale/es.js"></script>
    <script src="/lte/assets/libs/quill/quill.min.js"></script>
    <script>
        document.addEventListener('click', function(event) {
            const target = event.target;

            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');

                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    location.href = href;
                }
            }
        });
    </script>

</body>

</html>
