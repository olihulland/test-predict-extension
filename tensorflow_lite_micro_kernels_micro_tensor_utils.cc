/* Copyright 2019 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
#include "tensorflow_lite_micro_kernels_micro_tensor_utils.h"

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <limits>
#include <utility>

#include "fixedpoint_fixedpoint.h"
#include "tensorflow_lite_kernels_internal_common.h"
#include "tensorflow_lite_kernels_internal_compatibility.h"
#include "tensorflow_lite_kernels_internal_cppmath.h"
#include "tensorflow_lite_kernels_op_macros.h"

namespace tflite {

// Apply sigmoid to elements of a vector.
void PortableApplySigmoidToVector(const float* vector, int v_size,
                                  float* result) {
  for (int v = 0; v < v_size; v++) {
    result[v] = 1.0f / (1.0f + std::exp(-vector[v]));
  }
}

void PortableApplyTanhToVector(const float* vector, int v_size, float* result) {
  for (int v = 0; v < v_size; v++) {
    result[v] = std::tanh(vector[v]);
  }
}

void PortableApplyActivationToVector(const float* vector, int v_size,
                                     TfLiteFusedActivation activation,
                                     float* result) {
  switch (activation) {
    case kTfLiteActNone:
      return;
    case kTfLiteActRelu:
      return tflite::tensor_utils::ApplyReluToVector(vector, v_size, result);
    case kTfLiteActReluN1To1:
      return tflite::tensor_utils::ApplyRelu1ToVector(vector, v_size, result);
    case kTfLiteActRelu6:
      return tflite::tensor_utils::ApplyRelu6ToVector(vector, v_size, result);
    case kTfLiteActTanh:
      return PortableApplyTanhToVector(vector, v_size, result);
    case kTfLiteActSignBit:
      return tflite::tensor_utils::ApplySignbitToVector(vector, v_size, result);
    case kTfLiteActSigmoid:
      return PortableApplySigmoidToVector(vector, v_size, result);
  }
}

}  // namespace tflite