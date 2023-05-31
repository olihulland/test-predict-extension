#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(float * featureVector) {
        #if MICROBIT_CODAL
            return uBit.timer.getTime();
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}