#include "pxt.h"

#include "MicroBit.h"

using namespace pxt;

namespace predict {
    //%
    int predict(float * featureVector) {
        return uBit.getSerialNumber();
    }
}