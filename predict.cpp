#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    String predict(String featureVector) {
        #if MICROBIT_CODAL
            return featureVector;
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}