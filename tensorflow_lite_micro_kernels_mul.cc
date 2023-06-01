/* Copyright 2022 The TensorFlow Authors. All Rights Reserved.

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

#include "tensorflow_lite_micro_kernels_mul.h"

#include "tensorflow_lite_c_common.h"
#include "tensorflow_lite_kernels_internal_quantization_util.h"
#include "tensorflow_lite_kernels_internal_reference_integer_ops_mul.h"
#include "tensorflow_lite_kernels_internal_reference_mul.h"
#include "tensorflow_lite_kernels_internal_reference_process_broadcast_shapes.h"
#include "tensorflow_lite_kernels_internal_tensor_ctypes.h"
#include "tensorflow_lite_kernels_kernel_util.h"
#include "tensorflow_lite_micro_kernels_kernel_util.h"
#include "tensorflow_lite_micro_memory_helpers.h"
#include "tensorflow_lite_micro_micro_log.h"

namespace tflite {

TfLiteStatus MulEval(TfLiteContext* context, TfLiteNode* node) {
  TFLITE_DCHECK(node->builtin_data != nullptr);
  auto* params = reinterpret_cast<TfLiteMulParams*>(node->builtin_data);

  TFLITE_DCHECK(node->user_data != nullptr);
  const OpDataMul* data = static_cast<const OpDataMul*>(node->user_data);

  const TfLiteEvalTensor* input1 =
      tflite::micro::GetEvalInput(context, node, kMulInput1Tensor);
  const TfLiteEvalTensor* input2 =
      tflite::micro::GetEvalInput(context, node, kMulInput2Tensor);
  TfLiteEvalTensor* output =
      tflite::micro::GetEvalOutput(context, node, kMulOutputTensor);

  switch (input1->type) {
    case kTfLiteInt8:
    case kTfLiteInt16:
    case kTfLiteInt32:
      EvalMulQuantizedReference(context, node, data, input1, input2, output);
      break;
    case kTfLiteFloat32:
      EvalMulFloatReference(context, node, params, data, input1, input2,
                            output);
      break;
    default:
      MicroPrintf("Type %s (%d) not supported.",
                  TfLiteTypeGetName(input1->type), input1->type);
      return kTfLiteError;
  }

  return kTfLiteOk;
}

TfLiteRegistration Register_MUL() {
  return tflite::micro::RegisterOp(MulInit, MulPrepare, MulEval);
}

}  // namespace tflite
