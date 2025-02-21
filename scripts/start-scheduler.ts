import { spawn } from 'child_process'
import { join } from 'path'

function startWorker() {
  const workerPath = join(__dirname, '../src/workers/burn-scheduler-worker.ts')

  // Use ts-node to run the TypeScript worker
  const worker = spawn('npx', ['ts-node', workerPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production'
    }
  })

  worker.on('exit', (code, signal) => {
    console.log(`Worker process exited with code ${code} and signal ${signal}`)
    if (code !== 0) {
      console.log('Worker crashed, restarting...')
      startWorker()
    }
  })

  return worker
}

// Start the worker
console.log('Starting burn scheduler worker...')
startWorker()
