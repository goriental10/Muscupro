/** Continuous joint animation using cutouts from the user's illustration.
 * The source GIF only dissolves between two poses; it contains no travelling arms.
 * Coordinates are in the original 700 × 700 image. No new figure is generated.
 */
export const motionTiming = Object.freeze({ lift: 1450, top: 180, lower: 2050, bottom: 220 });
export const motionDuration = Object.values(motionTiming).reduce((sum, value) => sum + value, 0);
const clamp = value => Math.max(0, Math.min(1, value));
// Zero velocity AND acceleration at reversals, including the loop boundary.
export const smoothStep = value => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };

export function movementAtTime(milliseconds) {
  const time = ((milliseconds % motionDuration) + motionDuration) % motionDuration;
  const { lift, top, lower } = motionTiming;
  if (time < lift) return { amount: smoothStep(time / lift), label: 'Montée' };
  if (time < lift + top) return { amount: 1, label: 'Transition haute' };
  if (time < lift + top + lower) return { amount: 1 - smoothStep((time - lift - top) / lower), label: 'Descente' };
  return { amount: 0, label: 'Transition basse' };
}

const radians = degrees => degrees * Math.PI / 180;
const sides = {
  far: { shoulder: [307, 173], upper: 88, lower: 74, projection: -0.72, startAngle: 3, forearmOffset: 8 },
  near: { shoulder: [414, 171], upper: 91, lower: 88, projection: 0.72, startAngle: 11, forearmOffset: -15 },
};

/** Orthographic projection of constant-length bones, with a slight elbow bend.
 * Foreshortening comes from projection, not changing bone lengths over the cycle.
 */
export function armPose(side, amount) {
  const spec = sides[side];
  if (!spec) throw new Error('Unknown illustration arm');
  const lift = clamp(amount), angle = radians(spec.startAngle + (88 - spec.startAngle) * lift);
  const elbowAngle = angle + radians(spec.forearmOffset * (1 - lift) + 8 * lift);
  const shoulder = [spec.shoulder[0], spec.shoulder[1] - 4 * lift, 0];
  const depth = Math.sqrt(1 - spec.projection ** 2);
  const extend = (origin, length, theta) => [
    origin[0] + length * Math.sin(theta) * spec.projection,
    origin[1] + length * Math.cos(theta),
    origin[2] + length * Math.sin(theta) * depth,
  ];
  const elbow = extend(shoulder, spec.upper, angle);
  const wrist = extend(elbow, spec.lower, elbowAngle);
  return { shoulder, elbow, wrist, upperLength: spec.upper, lowerLength: spec.lower, lift };
}

const shapes = {
  body: 'M320 0H420V132Q398 135 390 144L397 190L400 219L407 264L413 302H318L319 257L315 215L308 197C306 181 307 163 316 151Q329 143 334 135Z',
  legs: 'M315 299H416L424 330L430 470L441 570L432 700H250L263 602L294 568L297 500L298 451L295 408L298 370Z',
  farUpper: 'M307 122C293 120 277 129 247 130L242 151C264 159 287 168 307 163Q314 143 307 122Z',
  farLower: 'M260 129C243 119 230 116 216 120L182 126L178 141L205 148C225 157 247 159 262 151Z',
  farHand: 'M187 125L194 142L186 150C177 170 162 182 144 176C119 174 111 147 117 131C123 110 153 96 174 103C188 107 192 116 187 125Z',
  nearUpper: 'M390 139C412 130 434 141 439 164C451 184 453 207 447 227L440 260Q428 276 415 265L407 244L402 214Q396 186 390 139Z',
  nearLower: 'M415 249C426 242 440 247 443 257C441 283 437 311 433 337L432 357L406 358L408 333L407 306C408 281 409 264 415 249Z',
  nearHand: 'M407 340L433 340L435 350C445 340 449 338 455 340C477 345 477 399 462 408C450 418 439 411 436 393L430 382C425 388 409 391 404 379C393 415 364 407 356 381C347 357 357 329 376 328C393 327 402 330 407 340Z',
  shoulder: 'M389 139C410 132 430 141 436 158C444 176 435 193 426 204C412 200 402 188 399 172C397 158 393 147 389 139Z',
  farShoulderCap: 'M314 146C303 151 298 163 298 181L302 204Q309 199 312 181L319 155Z',
};

/** Map a source bone to the projected target bone; keep its transverse volume. */
export function boneTransform(start, end, targetStart, targetEnd, thickness = 1) {
  const sx = end[0] - start[0], sy = end[1] - start[1], length = Math.hypot(sx, sy);
  const tx = targetEnd[0] - targetStart[0], ty = targetEnd[1] - targetStart[1], targetLength = Math.hypot(tx, ty);
  const ux = sx / length, uy = sy / length, vx = tx / length, vy = ty / length;
  const nx = -ty / targetLength * thickness, ny = tx / targetLength * thickness;
  const a = vx * ux - nx * uy, b = vy * ux - ny * uy;
  const c = vx * uy + nx * ux, d = vy * uy + ny * ux;
  return [a, b, c, d, targetStart[0] - a * start[0] - c * start[1], targetStart[1] - b * start[0] - d * start[1]];
}

export class ArticulatedIllustration {
  constructor(image, media) {
    this.image = image; this.media = media;
    this.paths = Object.fromEntries(Object.entries(shapes).map(([key, path]) => [key, new Path2D(path)]));
  }
  patch(ctx, name, transform) {
    ctx.save();
    if (transform) ctx.transform(...transform);
    ctx.clip(this.paths[name]);
    // Both endpoints are undissolved. The raised torso exposes the hips without
    // the lowered hands/weights; the far arm is fully visible in that pose.
    const raised = name === 'legs' || ['farUpper','farLower','farHand'].includes(name);
    ctx.drawImage(this.image, raised ? 1400 : 0, raised ? 700 : 0, 700, 700, 0, 0, 700, 700);
    ctx.restore();
  }
  arm(ctx, side, pose) {
    const near = side === 'near';
    const source = near ? [[414,171],[429,261],[419,348]] : [[307,143],[252,143],[184,133]];
    this.patch(ctx, `${side}Upper`, boneTransform(source[0], source[1], pose.shoulder, pose.elbow, near ? 1 - .1 * pose.lift : .7 + .2 * pose.lift));
    this.patch(ctx, `${side}Lower`, boneTransform(source[1], source[2], pose.elbow, pose.wrist, near ? 1 - .08 * pose.lift : .85 + .1 * pose.lift));
    // Keep hand + dumbbell rigid and aligned with the forearm (no wrist hinge).
    const angle = Math.atan2(pose.wrist[1]-pose.elbow[1],pose.wrist[0]-pose.elbow[0])-Math.atan2(source[2][1]-source[1][1],source[2][0]-source[1][0]);
    const c = Math.cos(angle), s = Math.sin(angle);
    this.patch(ctx, `${side}Hand`, [c,s,-s,c,pose.wrist[0]-c*source[2][0]+s*source[2][1],pose.wrist[1]-s*source[2][0]-c*source[2][1]]);
  }
  render(ctx, milliseconds) {
    const { amount } = movementAtTime(milliseconds);
    this.arm(ctx, 'far', armPose('far', amount));
    this.patch(ctx, 'body');
    this.patch(ctx, 'legs');
    this.patch(ctx, 'farShoulderCap', [1,0,0,1,0,-4*amount]);
    this.arm(ctx, 'near', armPose('near', amount));
    this.patch(ctx, 'shoulder', [1,0,0,1,0,-4*amount]);
  }
}
