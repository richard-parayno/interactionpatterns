# Ioskeley Mono

- Upstream: https://github.com/ahatem/IoskeleyMono
- Release: `v2.0.0`
- Archive: `IoskeleyMono-Web.zip`
- Archive SHA-256:
  `ce16de2dd834264445a5133a8dddfe058a8da295d4a308fe81c295e1d7143f4d`
- Source file: `WOFF2/IoskeleyMono-Regular.woff2` (482 KB, SHA-256
  `a5554f36ebc000b0c7edf1d58e7f7697dabca9a5b30c0f78f5f70f49002cab66`)

`IoskeleyMono-Regular-Latin.woff2` (19 KB) is a subset of that file, made so
code samples do not cost half a megabyte. It keeps Basic Latin, Latin-1,
general punctuation, arrows, and box drawing:

```
pyftsubset IoskeleyMono-Regular.woff2 \
  --unicodes='U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-203A,U+20AC,U+2122,U+2190-2199,U+21B5,U+2318,U+2325,U+21E7,U+2500-257F,U+2713,U+2717,U+FFFD' \
  --flavor=woff2 --layout-features='kern,mark,mkmk,ccmp,locl' \
  --output-file=IoskeleyMono-Regular-Latin.woff2
```

Ioskeley Mono is a custom configuration of Iosevka designed by Ahmed Hatem.
The font files are distributed under the SIL Open Font License 1.1, which
declares no Reserved Font Name. See `OFL.txt` in this directory.
