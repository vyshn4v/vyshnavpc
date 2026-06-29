import { appendQuestions } from "./appendQuestions.js";

const categoriesArray = [
  {
    categoryName: "React Server Components & SSR",
    questions: [
      {
        difficulty: 'Expert',
        question: 'How do React Server Components differ fundamentally from traditional SSR, and how does the serialization of the RSC payload impact the types of props you can pass between Server and Client Components?',
        expectedAnswer: 'RSCs stream a specialized JSON-like format representing UI rather than HTML. They execute entirely on the server and do not add to the client-side JavaScript bundle. Because they serialize data across the network boundary, you cannot pass non-serializable objects (like functions, classes, or DOM elements) directly as props from a Server Component to a Client Component.',
        redFlags: ['Confuses RSC with Next.js getServerSideProps or standard string-based SSR.', 'Thinks RSCs output HTML directly to the client bundle.', 'Doesn\'t understand the serialization boundary.'],
        bonusPoints: ['Mentions the exact RSC payload format.', 'Explains how Server Actions bridge the interactivity gap without passing functions as props directly.']
      },
      {
        difficulty: 'Hard',
        question: 'Describe a scenario where a Client Component is nested inside a Server Component, which is itself nested inside another Client Component. How does React handle the render tree and module graph resolution in this interwoven structure?',
        expectedAnswer: 'A Server Component cannot be imported and rendered directly inside a Client Component. However, a Server Component can be passed as a `children` prop to a Client Component. The Server Component is rendered on the server, its output is serialized into the RSC payload, and the Client Component slots that pre-rendered UI into its own render tree.',
        redFlags: ['Claims Server Components can simply be imported directly into Client Components.', 'Fails to understand the composition pattern using `children` props.'],
        bonusPoints: ['Mentions that the bundler splits the graph at the "use client" directive.', 'Explains that client references are created to load the client chunk dynamically.']
      },
      {
        difficulty: 'Expert',
        question: 'When implementing streaming SSR with React Suspense, how does the HTML response actually stream to the browser? How are fallback boundaries replaced with the actual content once resolved?',
        expectedAnswer: 'The server sends the initial shell HTML immediately along with Suspense fallbacks. As asynchronous data resolves, React streams additional HTML chunks and inline `<script>` tags over the same HTTP response. These scripts inject the resolved HTML into the correct DOM nodes, replacing the fallback UI, before the main JS bundle fully hydrates.',
        redFlags: ['Thinks streaming means WebSockets.', 'Doesn\'t understand that it relies on chunked transfer encoding and inline scripts.'],
        bonusPoints: ['Mentions "Selective Hydration" where React prioritizes hydrating the parts of the page the user interacts with first based on event delegation.']
      }
    ]
  },
  {
    categoryName: "WebGL & Advanced Graphics",
    questions: [
      {
        difficulty: 'Medium',
        question: 'In WebGL, what is the role of the Vertex Shader versus the Fragment Shader, and how does data flow between them via varyings?',
        expectedAnswer: 'The Vertex Shader computes the position of each vertex in clip space, executed once per vertex. The Fragment Shader computes the color of each pixel (fragment), executed once per rasterized pixel. Data is passed from the CPU to the Vertex Shader via attributes, and then interpolated across the primitive and passed to the Fragment Shader via varyings.',
        redFlags: ['Reverses the roles of the shaders.', 'Doesn\'t understand interpolation of varyings across the rasterized triangle.'],
        bonusPoints: ['Mentions the graphics pipeline stages (rasterization).', 'Mentions precision qualifiers for varyings in GLSL.']
      },
      {
        difficulty: 'Expert',
        question: 'Describe a technique to efficiently render 100,000 instances of the same 3D mesh in WebGL without overwhelming the CPU with draw calls.',
        expectedAnswer: 'Use Instanced Rendering (ANGLE_instanced_arrays in WebGL 1, or native gl.drawArraysInstanced in WebGL 2). Instead of issuing a draw call per object, you issue one draw call. Instance-specific data (like position, rotation) is passed via an instanced buffer attribute, and the vertex shader correctly positions each mesh.',
        redFlags: ['Suggests looping over the objects in JavaScript and calling gl.drawElements for each.', 'Suggests merging the geometry manually in JS on every frame.'],
        bonusPoints: ['Mentions updating instance data via Uniform Buffer Objects (UBOs) or textures if the instance count is exceptionally high.']
      },
      {
        difficulty: 'Hard',
        question: 'What causes "WebGL Context Loss", how can it be simulated, and what is the proper architectural approach to recover from it in a large-scale graphics application?',
        expectedAnswer: 'Context loss occurs when the OS reclaims GPU resources. The application must listen for webglcontextlost and webglcontextrestored events. Upon recovery, all WebGL resources (buffers, textures, shaders) are destroyed and must be completely recreated by the application before rendering can resume.',
        redFlags: ['Believes WebGL automatically restores textures and buffers.', 'Has never handled context loss in production.'],
        bonusPoints: ['Mentions the WEBGL_lose_context extension used to manually trigger and test context loss handling.']
      }
    ]
  },
  {
    categoryName: "Web Assembly (Wasm)",
    questions: [
      {
        difficulty: 'Expert',
        question: 'How does memory management work in WebAssembly when interoperating with JavaScript, and what are the specific challenges regarding passing complex objects (like strings or JSON) across the JS-Wasm boundary?',
        expectedAnswer: 'Wasm operates on a contiguous linear memory buffer (a JS ArrayBuffer) and only understands primitive numeric types. To pass strings or objects, JS must serialize the data, write it into the Wasm memory buffer at a specific offset, and pass the pointer and length to Wasm. Wasm then reads the bytes and reconstructs the data.',
        redFlags: ['Thinks Wasm can directly access JS objects or the DOM.', 'Doesn\'t understand linear memory or pointer arithmetic.'],
        bonusPoints: ['Mentions string encoding/decoding performance bottlenecks (e.g., TextEncoder).', 'Mentions the Wasm Interface Types proposal or wasm-bindgen in Rust.']
      },
      {
        difficulty: 'Hard',
        question: 'Explain the security model of WebAssembly. Can a malicious Wasm module execute arbitrary code on the host machine or access the browser\'s DOM directly?',
        expectedAnswer: 'Wasm runs in a secure, sandboxed environment. It cannot access the DOM, network, or filesystem directly unless the host JavaScript environment explicitly imports and exposes those functions to the Wasm module. Its execution is restricted by the browser\'s same-origin policy.',
        redFlags: ['Thinks Wasm is inherently unsafe or has raw system access.', 'Believes Wasm can bypass JS sandboxing.'],
        bonusPoints: ['Mentions Control Flow Integrity (CFI) within Wasm.', 'Mentions how memory bounds checking prevents buffer overruns from escaping the linear memory segment.']
      },
      {
        difficulty: 'Hard',
        question: 'What is the WebAssembly System Interface (WASI), and why is it significant for the future of Wasm outside the browser?',
        expectedAnswer: 'WASI is a standardized API that provides Wasm modules with secure, capability-based access to underlying OS features like files, network, and time. It allows Wasm to run on servers or Edge functions consistently without depending on a specific host environment\'s proprietary bindings.',
        redFlags: ['Confuses WASI with the browser DOM API.', 'Has no knowledge of Wasm running outside the browser.'],
        bonusPoints: ['Mentions capability-based security (restricting access to specific directories rather than the whole filesystem).']
      }
    ]
  },
  {
    categoryName: "Micro-frontends Architecture",
    questions: [
      {
        difficulty: 'Hard',
        question: 'Compare Module Federation (Webpack/Rspack) with iframe-based micro-frontends. What are the specific trade-offs regarding state sharing, routing, and CSS isolation?',
        expectedAnswer: 'Iframes offer perfect CSS/JS isolation but make state sharing difficult (postMessage), disrupt routing, and cause performance issues. Module Federation allows dynamic loading of remote modules into a single host application, sharing dependencies and routing, but requires strict CSS scoping to avoid global conflicts.',
        redFlags: ['Thinks Module Federation provides out-of-the-box CSS isolation.', 'Thinks iframes are easily integrated into unified SPA routing.'],
        bonusPoints: ['Discusses singleton dependencies in Module Federation.', 'Mentions Shadow DOM for CSS isolation in non-iframe architectures.']
      },
      {
        difficulty: 'Expert',
        question: 'In a Module Federation setup, how do you handle dependency version conflicts when Remote A requires React 17 and Remote B requires React 18, both loaded into Host H?',
        expectedAnswer: 'Module Federation allows specifying dependencies as singletons with required versions. If a strict mismatch occurs, it throws an error. Teams must either align on the major React version, or the architecture must fall back to running multiple React instances (which breaks the singleton rule) or using Web Components as a wrapper boundary.',
        redFlags: ['Thinks Webpack magically fixes major React version conflicts.', 'Fails to understand the implications of running multiple React versions simultaneously (Context API failures).'],
        bonusPoints: ['Mentions the `fallback` or `requiredVersion` configurations in shared dependencies.', 'Suggests avoiding React context across micro-frontend boundaries.']
      },
      {
        difficulty: 'Hard',
        question: 'How do you implement robust error handling and fallback UI boundaries when dynamically loading a remote micro-frontend that might be offline or failing to parse?',
        expectedAnswer: 'The host application must wrap the dynamically imported remote component in an Error Boundary and a Suspense boundary. If the network request fails or the module crashes, the Error Boundary catches the error and displays a localized fallback UI without crashing the host shell.',
        redFlags: ['Assumes the remote will always load.', 'Suggests using standard try/catch blocks around JSX rendering.'],
        bonusPoints: ['Discusses implementing a retry mechanism for fetching the remote script.', 'Suggests using service workers to cache the remote entry point.']
      }
    ]
  },
  {
    categoryName: "Deep Performance Profiling & Optimization",
    questions: [
      {
        difficulty: 'Expert',
        question: 'While profiling a React application in the Chrome Performance tab, you notice long "Recalculate Style" and "Layout" blocks causing dropped frames. What causes this, and how do you trace it back to the offending code?',
        expectedAnswer: 'This is "Layout Thrashing" or "Forced Synchronous Layout," caused by JavaScript writing to the DOM and then immediately reading a layout-dependent property (like offsetWidth). This forces a synchronous layout calculation. Trace it in the Call Tree by finding the JS function executing right before the Layout task and looking for warnings.',
        redFlags: ['Blames React reconciliation instead of DOM reads/writes.', 'Suggests using useMemo as a fix for layout thrashing.'],
        bonusPoints: ['Mentions grouping DOM reads and writes separately.', 'Mentions using requestAnimationFrame to schedule writes or using the fastdom library.']
      },
      {
        difficulty: 'Hard',
        question: 'Explain the difference between Time to Interactive (TTI), Total Blocking Time (TBT), and Interaction to Next Paint (INP). Why is INP replacing FID as a Core Web Vital?',
        expectedAnswer: 'TTI is when the page is fully interactive. TBT is the sum of time between FCP and TTI where the main thread was blocked >50ms. INP measures the latency of the worst interaction throughout the entire lifespan of the page. INP replaces FID because FID only measured the first interaction\'s delay, whereas INP captures overall responsiveness reliably.',
        redFlags: ['Confuses TBT with network download time.', 'Doesn\'t know what INP stands for or why it is replacing FID.'],
        bonusPoints: ['Explains that INP includes processing time and presentation delay, not just input delay.']
      },
      {
        difficulty: 'Expert',
        question: 'You have a massive Redux store and notice that dispatching a single action causes significant input lag, even though the reducer is fast. What profiling techniques and optimizations do you apply?',
        expectedAnswer: 'The issue is excessive component re-rendering triggered by state subscriptions. Use the React DevTools Profiler to identify components rendering unnecessarily. Optimize by ensuring useSelector hooks are granular, using memoized selectors (Reselect), and wrapping expensive components in React.memo with custom comparison functions if needed.',
        redFlags: ['Suggests removing Redux immediately without profiling.', 'Suggests the reducer is the bottleneck despite the prompt.'],
        bonusPoints: ['Discusses batching state updates.', 'Mentions normalizing the Redux state shape to avoid deep object updates triggering wide-spread re-renders.']
      }
    ]
  }
];

const run = async () => {
  try {
    await appendQuestions('round-2', categoriesArray);
    console.log('Script execution completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to append questions:', error);
    process.exit(1);
  }
};

run();
