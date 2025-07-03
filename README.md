# Text Similarity Checker — Thought process

### What I Thought About

- **How to compare texts fairly?**  
  First, I cleaned the texts by removing punctuation like commas and periods.  
  Then, I changed all words to lowercase so “Hello” and “hello” count as the same.  
  I split each text into separate words.  
  I put these words into sets to ignore duplicates.  
  Finally, I checked which words appear in both sets and counted them.
 
- **How to calculate similarity?**  
  I used the formula:  
  `(Number of shared words) / (Total unique words) * 100` to get a percentage.  

### How I Built It

- **Backend:**  
  Used plain Node.js HTTP server to handle requests. It takes two texts, processes them, calculates similarity, and saves the result in MongoDB. I added endpoints to get the history.  

- **Frontend:**  
  Built with React. It has two big text boxes side by side, a button to check similarity, and shows the results nicely. Also added a history section to show past checks.  

- **Constraints:**  
  Minimum Text length : 10 words
  Removed Punctuations and case insensitive
  
