document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submitButton');
  const resetButton = document.getElementById('resetButton');
  const customPatternInput = document.getElementById('customPatternInput');
  const totalWords = document.getElementById('totalWords');
  const redactionCount = document.getElementById('redactionCount');
  const wordsToRedactCount = document.getElementById('wordsToRedactCount');

  let allOutput = document.getElementById('allOutput');
  let redactedOutput = document.getElementById('redactedOutput');

  const patternSelect = document.getElementById('patternSelect');

  patternSelect.addEventListener('change', (e) => {
    // console.log('Change happened', e.target.value);
    if (e.target.value === '') {
      customPatternInput.style.display = 'block';
    } else {
      customPatternInput.style.display = 'none';
    }
  });

  submitButton.addEventListener('click', function (e) {
    e.preventDefault();

    // Record start time
    const startTime = new Date().getTime();

    const redactionPattern =
      patternSelect.value || document.getElementById('customPattern').value;

    const wordsToRedact = document
      .getElementById('wordsToRedact')
      .value.trim()
      .split(' ');

    const originalText = document.getElementById('content').value;

    if (!redactionPattern || !wordsToRedact || !originalText.trim()) {
      alert('Please provide all possible fields');
      return;
    }
    // Count total words
    totalWords.innerText = originalText.trim().split(' ').length;

    let redactedText = originalText;
    let redactedWordsCount = 0;
    wordsToRedact.forEach((word, index) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      //   Redact the words and count the instances
      redactedText = redactedText.replace(regex, (match) => {
        redactedWordsCount++;
        return redactionPattern;
      });
    });

    // Count the total number of words to be redacted and the total number of successful redaction
    wordsToRedactCount.innerText = wordsToRedact.length;
    redactionCount.innerText = redactedWordsCount;
    redactedOutput.innerText = redactedText;
    allOutput.style.display = 'block';

    // Record end time
    const endTime = new Date().getTime();
    // Calculate total time in seconds and set it
    const totalTime = endTime - startTime;
    document.getElementById('totalTime').innerText = totalTime;
    // console.log('Time taken is ', startTime, endTime);
    // console.log('Total time taken is ', totalTime);
  });

  resetButton.addEventListener('click', function () {
    output.innerText = '';
    output.style.display = 'none';
  });

  //   Still testing the code
  const copyText = () => {
    navigator.clipboard.write(output);
  };
});
