/**
 * Request Flow Animation System
 * GSAP-based animations for request flow visualization
 *
 * @module utils/animation
 */

import { gsap } from 'gsap';
import { ANIMATION_EASING } from '../constants/kubernetes';
import type { RequestFlow } from '../types/kubernetes';

/**
 * Animation configuration options
 */
export interface AnimationOptions {
	/** Animation duration in milliseconds */
	duration?: number;

	/** Easing function */
	easing?: string;

	/** Delay before animation starts in milliseconds */
	delay?: number;

	/** Whether to loop the animation */
	loop?: boolean;

	/** Speed multiplier (1 = normal speed) */
	speed?: number;
}

/**
 * Animation progress callback
 */
export type ProgressCallback = (progress: number, currentStep: number) => void;

/**
 * RequestFlowAnimator class
 * Manages GSAP-based animations for request flows
 */
export class RequestFlowAnimator {
	private timeline: gsap.core.Timeline | null = null;
	private cleanupFunctions: Array<() => void> = [];
	private currentProgress: number = 0;
	private isPaused: boolean = false;

	/**
	 * Creates and starts an animation for a request flow
	 *
	 * @param path - Array of component IDs in the flow path
	 * @param options - Animation configuration options
	 * @param onProgress - Callback for animation progress updates
	 * @returns Promise that resolves when animation completes
	 */
	async animate(
		path: string[],
		options: AnimationOptions = {},
		onProgress?: ProgressCallback
	): Promise<void> {
		// Cleanup previous animation if exists
		this.cancel();

		const {
			duration = 3000,
			easing = ANIMATION_EASING.DEFAULT,
			delay = 0,
			loop = false,
			speed = 1
		} = options;

		return new Promise((resolve, reject) => {
			try {
				// Create timeline
				this.timeline = gsap.timeline({
					paused: false,
					repeat: loop ? -1 : 0,
					onComplete: () => {
						this.currentProgress = 1;
						onProgress?.(1, path.length - 1);
						resolve();
					},
					onUpdate: () => {
						if (this.timeline) {
							const progress = this.timeline.progress();
							const currentStep = Math.floor(progress * (path.length - 1));
							this.currentProgress = progress;
							onProgress?.(progress, currentStep);
						}
					}
				});

				// Calculate duration per step
				const stepDuration = (duration / speed) / path.length;

				// Add animations for each step
				path.forEach((componentId, index) => {
					if (!this.timeline) return;

					const element = document.querySelector(`[data-component-id="${componentId}"]`);

					if (element) {
						// Highlight animation
						this.timeline.to(
							element,
							{
								scale: 1.1,
								boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
								duration: stepDuration * 0.3,
								ease: 'power2.out'
							},
							index * stepDuration + delay / 1000
						);

						// Reset animation
						this.timeline.to(
							element,
							{
								scale: 1,
								boxShadow: 'none',
								duration: stepDuration * 0.2,
								ease: 'power2.in'
							},
							index * stepDuration + (stepDuration * 0.3) + delay / 1000
						);
					}

					// Add flow line animation if not last step
					if (index < path.length - 1) {
						const nextComponentId = path[index + 1];
						const flowLine = document.querySelector(
							`[data-flow-line="${componentId}-${nextComponentId}"]`
						);

						if (flowLine) {
							this.timeline.fromTo(
								flowLine,
								{
									strokeDashoffset: 1000,
									opacity: 0
								},
								{
									strokeDashoffset: 0,
									opacity: 1,
									duration: stepDuration * 0.5,
									ease: easing
								},
								index * stepDuration + (stepDuration * 0.3) + delay / 1000
							);
						}
					}
				});

				// Adjust timeline speed
				if (this.timeline) {
					this.timeline.timeScale(speed);
				}

				// Store cleanup function
				this.cleanupFunctions.push(() => {
					// Reset all animated elements
					path.forEach((componentId) => {
						const element = document.querySelector(
							`[data-component-id="${componentId}"]`
						);
						if (element) {
							gsap.set(element, {
								scale: 1,
								boxShadow: 'none'
							});
						}
					});
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Pauses the current animation
	 */
	pause(): void {
		if (this.timeline && !this.isPaused) {
			this.timeline.pause();
			this.isPaused = true;
		}
	}

	/**
	 * Resumes a paused animation
	 */
	resume(): void {
		if (this.timeline && this.isPaused) {
			this.timeline.resume();
			this.isPaused = false;
		}
	}

	/**
	 * Cancels the current animation and cleans up
	 */
	cancel(): void {
		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}

		// Run cleanup functions
		this.cleanupFunctions.forEach((cleanup) => {
			try {
				cleanup();
			} catch (error) {
				console.error('Error during animation cleanup:', error);
			}
		});

		this.cleanupFunctions = [];
		this.currentProgress = 0;
		this.isPaused = false;
	}

	/**
	 * Gets the current animation progress (0-1)
	 *
	 * @returns Current progress value
	 */
	getProgress(): number {
		return this.currentProgress;
	}

	/**
	 * Checks if animation is currently paused
	 *
	 * @returns true if paused, false otherwise
	 */
	isPausedState(): boolean {
		return this.isPaused;
	}

	/**
	 * Checks if animation is currently running
	 *
	 * @returns true if running, false otherwise
	 */
	isRunning(): boolean {
		return this.timeline !== null && !this.isPaused;
	}

	/**
	 * Seeks to a specific progress point in the animation
	 *
	 * @param progress - Progress value (0-1)
	 */
	seek(progress: number): void {
		if (this.timeline) {
			const clampedProgress = Math.max(0, Math.min(1, progress));
			this.timeline.progress(clampedProgress);
			this.currentProgress = clampedProgress;
		}
	}

	/**
	 * Destroys the animator and cleans up all resources
	 */
	destroy(): void {
		this.cancel();
	}
}

/**
 * Creates a pulsing animation for active components
 *
 * @param elementSelector - CSS selector for target element
 * @param options - Animation options
 * @returns GSAP timeline instance
 */
export function createPulseAnimation(
	elementSelector: string,
	options: {
		scale?: number;
		duration?: number;
		color?: string;
	} = {}
): gsap.core.Timeline {
	const { scale = 1.05, duration = 1.5, color = 'rgba(59, 130, 246, 0.3)' } = options;

	const timeline = gsap.timeline({
		repeat: -1,
		yoyo: true
	});

	timeline.to(elementSelector, {
		scale,
		boxShadow: `0 0 20px ${color}`,
		duration,
		ease: 'power1.inOut'
	});

	return timeline;
}

/**
 * Creates a flowing particle effect along a path
 *
 * @param svgPath - SVG path element
 * @param options - Animation options
 * @returns GSAP timeline instance
 */
export function createFlowParticles(
	svgPath: SVGPathElement,
	options: {
		particleCount?: number;
		duration?: number;
		color?: string;
		size?: number;
	} = {}
): gsap.core.Timeline {
	const {
		particleCount = 5,
		duration = 2,
		color = '#3b82f6',
		size = 4
	} = options;

	const timeline = gsap.timeline({
		repeat: -1
	});

	const svg = svgPath.ownerSVGElement;
	if (!svg) return timeline;

	// Create particles
	for (let i = 0; i < particleCount; i++) {
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('r', size.toString());
		circle.setAttribute('fill', color);
		svg.appendChild(circle);

		// Animate along path
		timeline.to(
			circle,
			{
				motionPath: {
					path: svgPath,
					align: svgPath,
					autoRotate: false,
					alignOrigin: [0.5, 0.5]
				},
				duration,
				ease: 'none'
			},
			i * (duration / particleCount)
		);

		// Cleanup on timeline kill
		timeline.eventCallback('onComplete', () => {
			circle.remove();
		});
	}

	return timeline;
}

/**
 * Singleton animator instance for global use
 */
export const requestFlowAnimator = new RequestFlowAnimator();
