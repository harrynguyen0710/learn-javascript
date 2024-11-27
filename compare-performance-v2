const { Worker, isMainThread, parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');

if (isMainThread) {
    const N = 1e7; // Range of numbers to process
    const numWorkers = 4; // Number of threads

    // Sequential Computation
    console.log('Starting Sequential Computation...');
    const startSeq = performance.now();
    const primesSequential = calculatePrimes(1, N);
    const endSeq = performance.now();
    console.log(`Sequential Primes Count: ${primesSequential.length}`);
    console.log(`Sequential Time: ${(endSeq - startSeq).toFixed(2)}ms`);

    // Parallel Computation
    console.log('\nStarting Parallel Computation...');
    const startPar = performance.now();
    const range = Math.ceil(N / numWorkers);
    const workers = [];
    let primesParallel = [];
    let completed = 0;

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename);
        workers.push(worker);

        const start = i * range + 1;
        const end = Math.min((i + 1) * range, N);

        worker.postMessage({ start, end });

        worker.on('message', (primes) => {
            primesParallel = primesParallel.concat(primes);
            completed++;

            if (completed === numWorkers) {
                const endPar = performance.now();
                console.log(`Parallel Primes Count: ${primesParallel.length}`);
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
        const primes = calculatePrimes(start, end);
        parentPort.postMessage(primes);
    });

    function calculatePrimes(start, end) {
        const primes = [];
        for (let num = start; num <= end; num++) {
            if (isPrime(num)) primes.push(num);
        }
        return primes;
    }

    function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
}

// Function for sequential calculation
function calculatePrimes(start, end) {
    const primes = [];
    for (let num = start; num <= end; num++) {
        if (isPrime(num)) primes.push(num);
    }
    return primes;
}

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return true;
}
