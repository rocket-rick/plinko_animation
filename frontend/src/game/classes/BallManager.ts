import { HEIGHT, WIDTH, ballRadius, obstacleRadius, sinkWidth } from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";

export class BallManager {
    private balls: Ball[];
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[];
    private sinks: Sink[];
    private requestId?: number;
    private lastTime: number;
    private speedMultiplier: number;
    private onFinish?: (index: number, startX?: number) => void;

    constructor(canvasRef: HTMLCanvasElement, onFinish?: (index: number, startX?: number, deltaTime?: number) => void) {
        this.balls = [];
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.obstacles = createObstacles();
        this.sinks = createSinks();
        this.lastTime = 0;
        this.speedMultiplier = 50; // Adjust if needed
        this.onFinish = onFinish;
        this.gameLoop = this.gameLoop.bind(this);
        this.start();
    }

    addBall(startX?: number) {
        const newBall = new Ball(
            4027628.395823398,
            pad(50),
            ballRadius,
            'red',
            this.ctx,
            this.obstacles,
            this.sinks,
            { x: 208, y: pad(630) }, // Target endpoint
            (index) => {
                this.balls = this.balls.filter(ball => ball !== newBall);
                this.onFinish?.(index, startX);
            }
        );
        this.balls.push(newBall);
    }

    drawObstacles() {
        this.ctx.fillStyle = 'white';
        this.obstacles.forEach((obstacle) => {
            this.ctx.beginPath();
            this.ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }

    getColor(index: number) {
        // Color mapping logic remains unchanged
        if (index < 3 || index > this.sinks.length - 3) {
            return { background: '#ff003f', color: 'white' };
        }
        if (index < 6 || index > this.sinks.length - 6) {
            return { background: '#ff7f00', color: 'white' };
        }
        if (index < 9 || index > this.sinks.length - 9) {
            return { background: '#ffbf00', color: 'black' };
        }
        if (index < 12 || index > this.sinks.length - 12) {
            return { background: '#ffff00', color: 'black' };
        }
        if (index < 15 || index > this.sinks.length - 15) {
            return { background: '#bfff00', color: 'black' };
        }
        return { background: '#7fff00', color: 'black' };
    }

    drawSinks() {
        // console.log("Drawing sinks", this.sinks)
        this.ctx.fillStyle = 'green';
        const SPACING = obstacleRadius * 2;
        for (let i = 0; i < this.sinks.length; i++) {
            this.ctx.fillStyle = this.getColor(i).background;
            const sink = this.sinks[i];
            this.ctx.font = 'normal 13px Arial';
            this.ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - SPACING, sink.height);
            this.ctx.fillStyle = this.getColor(i).color;
            this.ctx.fillText((sink?.multiplier)?.toString() + "x", sink.x - 15 + sinkWidth / 2, sink.y);
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.drawObstacles();
        this.drawSinks();
        this.balls.forEach(ball => {
            ball.draw();
        });
    }

    update(deltaTime: number) {
        this.balls.forEach(ball => {
            ball.update(deltaTime);
        });
    }

    gameLoop(timestamp: number) {
        const deltaTime = (timestamp - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = timestamp;

        this.draw();
        this.update(deltaTime * this.speedMultiplier);

        this.requestId = requestAnimationFrame(this.gameLoop);
    }

    start() {
        this.requestId = requestAnimationFrame(this.gameLoop);
    }

    stop() {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
    }
}
