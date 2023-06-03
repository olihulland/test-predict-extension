#include "pxt.h"

#include "MicroBit.h"
#include "model.h"

#if MICROBIT_CODAL
#include "tflite_codal.h"
#endif

using namespace pxt;

namespace predict {
    TfLiteCodal * tf;

    bool initialised = false;

    void init() {
        if (!initialised) {
            tf = new TfLiteCodal();
            tf->initialise(model_tflite, 4000);
            initialised = true;
        }
    }
    

    //%
    int predict(String featureVector, int maxClassNum) {
        #if MICROBIT_CODAL
            // PARSE FEATURE VECTOR STRING TO FLOAT ARRAY

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

            // CONDUCT INFERENCE AND RETURN PREDCITED CLASS

            init();

            float * results = (float *) tf->inferArray(data, tf->TensorType::TT_FLOAT, index+1);

            // find max num
            float max = 0;
            int maxIndex = -1;
            for (int i = 0; i < maxClassNum+1; i++) {
                if (results[i] > max) {
                    max = results[i];
                    maxIndex = i;
                }
            }

            return maxIndex;
        #else
            target_panic(PANIC_VARIANT_NOT_SUPPORTED);
        #endif
    }
}