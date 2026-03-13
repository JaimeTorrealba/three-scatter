import {
  AnimationClip,
  AnimationMixer,
  Matrix4,
  Quaternion,
  QuaternionKeyframeTrack,
  SkeletonHelper,
  Vector3,
  VectorKeyframeTrack
} from "./chunk-U7WRKFVC.js";
import "./chunk-BUSYA2B4.js";

// node_modules/.pnpm/three@0.176.0/node_modules/three/examples/jsm/utils/SkeletonUtils.js
function getBoneName(bone, options) {
  if (options.getBoneName !== void 0) {
    return options.getBoneName(bone);
  }
  return options.names[bone.name];
}
function retarget(target, source, options = {}) {
  const quat = new Quaternion(), scale = new Vector3(), relativeMatrix = new Matrix4(), globalMatrix = new Matrix4();
  options.preserveBoneMatrix = options.preserveBoneMatrix !== void 0 ? options.preserveBoneMatrix : true;
  options.preserveBonePositions = options.preserveBonePositions !== void 0 ? options.preserveBonePositions : true;
  options.useTargetMatrix = options.useTargetMatrix !== void 0 ? options.useTargetMatrix : false;
  options.hip = options.hip !== void 0 ? options.hip : "hip";
  options.hipInfluence = options.hipInfluence !== void 0 ? options.hipInfluence : new Vector3(1, 1, 1);
  options.scale = options.scale !== void 0 ? options.scale : 1;
  options.names = options.names || {};
  const sourceBones = source.isObject3D ? source.skeleton.bones : getBones(source), bones = target.isObject3D ? target.skeleton.bones : getBones(target);
  let bone, name, boneTo, bonesPosition;
  if (target.isObject3D) {
    target.skeleton.pose();
  } else {
    options.useTargetMatrix = true;
    options.preserveBoneMatrix = false;
  }
  if (options.preserveBonePositions) {
    bonesPosition = [];
    for (let i = 0; i < bones.length; i++) {
      bonesPosition.push(bones[i].position.clone());
    }
  }
  if (options.preserveBoneMatrix) {
    target.updateMatrixWorld();
    target.matrixWorld.identity();
    for (let i = 0; i < target.children.length; ++i) {
      target.children[i].updateMatrixWorld(true);
    }
  }
  for (let i = 0; i < bones.length; ++i) {
    bone = bones[i];
    name = getBoneName(bone, options);
    boneTo = getBoneByName(name, sourceBones);
    globalMatrix.copy(bone.matrixWorld);
    if (boneTo) {
      boneTo.updateMatrixWorld();
      if (options.useTargetMatrix) {
        relativeMatrix.copy(boneTo.matrixWorld);
      } else {
        relativeMatrix.copy(target.matrixWorld).invert();
        relativeMatrix.multiply(boneTo.matrixWorld);
      }
      scale.setFromMatrixScale(relativeMatrix);
      relativeMatrix.scale(scale.set(1 / scale.x, 1 / scale.y, 1 / scale.z));
      globalMatrix.makeRotationFromQuaternion(quat.setFromRotationMatrix(relativeMatrix));
      if (target.isObject3D) {
        if (options.localOffsets) {
          if (options.localOffsets[bone.name]) {
            globalMatrix.multiply(options.localOffsets[bone.name]);
          }
        }
      }
      globalMatrix.copyPosition(relativeMatrix);
    }
    if (name === options.hip) {
      globalMatrix.elements[12] *= options.scale * options.hipInfluence.x;
      globalMatrix.elements[13] *= options.scale * options.hipInfluence.y;
      globalMatrix.elements[14] *= options.scale * options.hipInfluence.z;
      if (options.hipPosition !== void 0) {
        globalMatrix.elements[12] += options.hipPosition.x * options.scale;
        globalMatrix.elements[13] += options.hipPosition.y * options.scale;
        globalMatrix.elements[14] += options.hipPosition.z * options.scale;
      }
    }
    if (bone.parent) {
      bone.matrix.copy(bone.parent.matrixWorld).invert();
      bone.matrix.multiply(globalMatrix);
    } else {
      bone.matrix.copy(globalMatrix);
    }
    bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
    bone.updateMatrixWorld();
  }
  if (options.preserveBonePositions) {
    for (let i = 0; i < bones.length; ++i) {
      bone = bones[i];
      name = getBoneName(bone, options) || bone.name;
      if (name !== options.hip) {
        bone.position.copy(bonesPosition[i]);
      }
    }
  }
  if (options.preserveBoneMatrix) {
    target.updateMatrixWorld(true);
  }
}
function retargetClip(target, source, clip, options = {}) {
  options.useFirstFramePosition = options.useFirstFramePosition !== void 0 ? options.useFirstFramePosition : false;
  options.fps = options.fps !== void 0 ? options.fps : Math.max(...clip.tracks.map((track) => track.times.length)) / clip.duration;
  options.names = options.names || [];
  if (!source.isObject3D) {
    source = getHelperFromSkeleton(source);
  }
  const numFrames = Math.round(clip.duration * (options.fps / 1e3) * 1e3), delta = clip.duration / (numFrames - 1), convertedTracks = [], mixer = new AnimationMixer(source), bones = getBones(target.skeleton), boneDatas = [];
  let positionOffset, bone, boneTo, boneData, name;
  mixer.clipAction(clip).play();
  let start = 0, end = numFrames;
  if (options.trim !== void 0) {
    start = Math.round(options.trim[0] * options.fps);
    end = Math.min(Math.round(options.trim[1] * options.fps), numFrames) - start;
    mixer.update(options.trim[0]);
  } else {
    mixer.update(0);
  }
  source.updateMatrixWorld();
  for (let frame = 0; frame < end; ++frame) {
    const time = frame * delta;
    retarget(target, source, options);
    for (let j = 0; j < bones.length; ++j) {
      bone = bones[j];
      name = getBoneName(bone, options) || bone.name;
      boneTo = getBoneByName(name, source.skeleton);
      if (boneTo) {
        boneData = boneDatas[j] = boneDatas[j] || { bone };
        if (options.hip === name) {
          if (!boneData.pos) {
            boneData.pos = {
              times: new Float32Array(end),
              values: new Float32Array(end * 3)
            };
          }
          if (options.useFirstFramePosition) {
            if (frame === 0) {
              positionOffset = bone.position.clone();
            }
            bone.position.sub(positionOffset);
          }
          boneData.pos.times[frame] = time;
          bone.position.toArray(boneData.pos.values, frame * 3);
        }
        if (!boneData.quat) {
          boneData.quat = {
            times: new Float32Array(end),
            values: new Float32Array(end * 4)
          };
        }
        boneData.quat.times[frame] = time;
        bone.quaternion.toArray(boneData.quat.values, frame * 4);
      }
    }
    if (frame === end - 2) {
      mixer.update(delta - 1e-7);
    } else {
      mixer.update(delta);
    }
    source.updateMatrixWorld();
  }
  for (let i = 0; i < boneDatas.length; ++i) {
    boneData = boneDatas[i];
    if (boneData) {
      if (boneData.pos) {
        convertedTracks.push(new VectorKeyframeTrack(
          ".bones[" + boneData.bone.name + "].position",
          boneData.pos.times,
          boneData.pos.values
        ));
      }
      convertedTracks.push(new QuaternionKeyframeTrack(
        ".bones[" + boneData.bone.name + "].quaternion",
        boneData.quat.times,
        boneData.quat.values
      ));
    }
  }
  mixer.uncacheAction(clip);
  return new AnimationClip(clip.name, -1, convertedTracks);
}
function clone(source) {
  const sourceLookup = /* @__PURE__ */ new Map();
  const cloneLookup = /* @__PURE__ */ new Map();
  const clone2 = source.clone();
  parallelTraverse(source, clone2, function(sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });
  clone2.traverse(function(node) {
    if (!node.isSkinnedMesh) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
    clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
      return cloneLookup.get(bone);
    });
    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });
  return clone2;
}
function getBoneByName(name, skeleton) {
  for (let i = 0, bones = getBones(skeleton); i < bones.length; i++) {
    if (name === bones[i].name)
      return bones[i];
  }
}
function getBones(skeleton) {
  return Array.isArray(skeleton) ? skeleton : skeleton.bones;
}
function getHelperFromSkeleton(skeleton) {
  const source = new SkeletonHelper(skeleton.bones[0]);
  source.skeleton = skeleton;
  return source;
}
function parallelTraverse(a, b, callback) {
  callback(a, b);
  for (let i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
}
export {
  clone,
  retarget,
  retargetClip
};
//# sourceMappingURL=three_examples_jsm_utils_SkeletonUtils__js.js.map
