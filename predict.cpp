#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(String featureVector) {
        #if MICROBIT_CODAL           
            const char * strData = PXT_STRING_DATA(featureVector);
            int strLen = PXT_STRING_DATA_LENGTH(featureVector);

            int len = 1;
            for (int i = 0; i < strLen; i++) {
                if (strData[i] == ',') {
                    len++;
                }
            }

            return len;
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}