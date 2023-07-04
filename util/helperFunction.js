helperFunction = {};

helperFunction.runFunctionOverIntervals = function runFunctionOverIntervals(func, intervals = [], prevDelay = 0) {
    if (intervals.length > 0) {
        let firstInterval = intervals[0];
        let delayAmt = firstInterval.delay + prevDelay;
        if (firstInterval.duration) {
            prevDelay = firstInterval.duration;
        } else {
            prevDelay = 0;
        }
        setTimeout(() => {
            func(firstInterval);
            intervals.shift();
            helperFunction.runFunctionOverIntervals(func, intervals, prevDelay);
        }, delayAmt);
    }
}
