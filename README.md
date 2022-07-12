# GPGPU In The Browser!

```
yarn
&
yarn dev
```

This [optical flow](https://en.wikipedia.org/wiki/Optical_flow) demo implements the [Lucas–Kanade method](https://en.wikipedia.org/wiki/Lucas–Kanade_method) and performs realtime computation on the GPU using the [GPU.js](https://gpu.rocks/#/) which transpiles JavaScript to [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language).

As GPUs are designed to process four 8 bit color values (RGBA), this can be exploited to process any arbitrary array of 32 bit values, provided operations can be done in parallel. This lends itself nicely to image and video processing.

The sample footage is from the [comma.ai speed challenge](https://github.com/commaai/speedchallenge).

This is Part 1 of estimating vehicle speed from optical flow, which is a lot more complicated than I originally thought, and probably not the best approach.

# Deployment

Due to missing `glibc` libraries on some deployment playforms, such as Vercel, it may be easier to deploy the `dist` folder as a static site (rather than build from `src`).

An installed `pre-commit hook` will build the `dist` folder on every `git commit` to ensure a fresh build is deployed.
