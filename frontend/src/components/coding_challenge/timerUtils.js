/**

 * @param {number} seconds 
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**

 * @param {number} initialTime 
 * @param {function} onTimeUp 
 * @param {boolean} isActive 
 * @returns {object} 
 */
export const useCountdownTimer = (initialTime, onTimeUp, isActive = true) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isActive, onTimeUp]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    setTimeRemaining
  };
};