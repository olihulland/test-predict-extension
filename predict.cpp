#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(float f0, float f1, float f2, float f3, float f4, float f5, float f6, float f7, float f8, float f9, float f10, float f11, float f12) {
        #if MICROBIT_CODAL           
            float featureVector[13] = {f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11,f12};
            return (int) featureVector[1];
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }



    // int predict(String featureVector) {
    //     #if MICROBIT_CODAL           
    //         const char * strData = PXT_STRING_DATA(featureVector);
    //         int len = PXT_STRING_DATA_LENGTH(featureVector);
    //         return len;
    //     #else
    //         target_panic(PANIC_VARIANT_NOT_SUPPORTED);
    //     #endif
    // }
}