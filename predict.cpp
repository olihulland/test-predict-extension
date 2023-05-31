#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(String featureVector) {
        #if MICROBIT_CODAL           
            return featureVector.find(",");
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}