// Helper functions for Mischief Manager

// Format currency without $ symbol (using USD instead)
const formatMoney = (amount) => {
    return `USD ${amount.toFixed(2)}`;
};

// Simple mood check function
const checkMoodState = () => {
    return {
        timestamp: Date.now(),
        moodOptions: [
            'Very Low',
            'Low',
            'Neutral',
            'Good',
            'Very Good'
        ]
    };
};

// Basic cool-down timer
const startCoolDown = (minutes) => {
    return {
        startTime: Date.now(),
        duration: minutes * 60 * 1000,
        active: true
    };
};

export {
    formatMoney,
    checkMoodState,
    startCoolDown
};
