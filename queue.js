
const map = new WeakMap();

class TamperQueue {
    constructor(enqueue) {
        if(typeof enqueue !== 'function') {
            throw new Error('Invalid argument, argument must be a function');
        }
        const secret = {
            queue: [],
            waiting: [],
            addToQueue(elem) {
                if(this.waiting.length > 0) {
                    const resolve = this.waiting.shift();
                    resolve(elem);
                }else {
                    process.nextTick(() => {
                        this.queue.push(elem)
                    })
                }
            },
            getFromQueue() {
                return new Promise((res) => {
                    if(this.queue.length > 0) {
                        res(this.queue.shift())
                    }else {
                        this.waiting.push(res);
                    }
                })
            }
        }

        map.set(this, secret);

        enqueue(secret.addToQueue.bind(secret));
    }


    dequeue() {
        const secret = map.get(this);
        return secret.getFromQueue();
    }
}


export default TamperQueue;