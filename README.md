# rendertex
A API for rendering inline math equations.


## Endpoints

```

┌ latex/
├── svg/:data
├── png/:data
└── jpg/:data

:data — parameter accepting any MathJax compatible LaTeX

png and jpg have optional query parameters `scale` and `padding` defined in ./types/SvgToSharpOptions.ts 
```
