#include "pxt.h"

#include "MicroBit.h"
#include "model.h"

// #if MICROBIT_CODAL
// #include "tflite_codal.h"
// #endif

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

            float * data = (float *)malloc(sizeof(float) * len);
            
            // parse the string into the float array data
            int index = 0;
            int start = 0;
            for (int i = 0; i < strLen; i++) {
                if (strData[i] == ',') {
                    int end = i - 1;
                    int numLen = end - start + 1;
                    char * numStr = (char *)malloc(sizeof(char) * (numLen + 1));
                    memcpy(numStr, strData + start, numLen);
                    numStr[numLen] = '\0';
                    data[index] = atof(numStr);
                    index++;
                    start = i + 1;
                }
            }
            int end = strLen - 1;
            int numLen = end - start + 1;
            char * numStr = (char *)malloc(sizeof(char) * (numLen + 1));
            memcpy(numStr, strData + start, numLen);
            numStr[numLen] = '\0';
            data[index] = atof(numStr);

            // TODO havent checked negatives parsed properly or that decimals are maintained (could test by mult by 10 and checking)

            return (int)data[12];
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}