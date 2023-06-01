#include <cstdint>

#include "tensorflow_lite_experimental_microfrontend_lib_kiss_fft_common.h"

#define FIXED_POINT 16
namespace kissfft_fixed16 {
#include "kiss_fft.c"
#include "tools_kiss_fftr.c"
}  // namespace kissfft_fixed16
#undef FIXED_POINT
