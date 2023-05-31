#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(RefCollection featureVector) {
        #if MICROBIT_CODAL
            
            return featureVector.length();
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}