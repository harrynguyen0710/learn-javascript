const { Worker, isMainThread, parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');

if (isMainThread) {
    const N = 1e7; // Range of numbers to process

    // Sequential computation
    console.log('Starting Sequential Computation...');
    const startSeq = performance.now();
    const sumSequential = calculateSumOfSquares(N);
    const endSeq = performance.now();
    console.log(`Sequential Result: ${sumSequential}`);
    console.log(`Sequential Time: ${(endSeq - startSeq).toFixed(2)}ms`);

    // Parallel computation
    console.log('\nStarting Parallel Computation...');
    const startPar = performance.now();

    const numWorkers = 4; // Number of threads
    const range = Math.ceil(N / numWorkers);
    const workers = [];
    let partialSums = 0;
    let completed = 0;

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename);
        workers.push(worker);

        const start = i * range + 1;
        const end = Math.min((i + 1) * range, N);

        worker.postMessage({ start, end });

        worker.on('message', (sum) => {
            partialSums += sum;
            completed++;

            if (completed === numWorkers) {
                const endPar = performance.now();
                console.log(`Parallel Result: ${partialSums}`);
                console.log(`Parallel Time: ${(endPar - startPar).toFixed(2)}ms`);

                // Clean up workers
                workers.forEach((worker) => worker.terminate());
            }
        });

        worker.on('error', (err) => console.error('Worker Error:', err));
    }
} else {
    // Worker Thread Code
    parentPort.on('message', ({ start, end }) => {
        const sum = calculateSumOfSquares(start, end);
        parentPort.postMessage(sum);
    });

    function calculateSumOfSquares(start, end) {
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += i * i;
        }
        return sum;
    }
}

// Function for sequential calculation
function calculateSumOfSquares(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i * i;
    }
    return sum;
}
