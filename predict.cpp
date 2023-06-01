#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(RefCollection featureVector) {
        #if MICROBIT_CODAL           
            int len = featureVector.length();
            return len;
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