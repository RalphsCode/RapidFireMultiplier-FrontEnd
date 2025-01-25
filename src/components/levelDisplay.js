export function levelDisplay(level) {
    let levelText;
  
    if (level === 1) {
      levelText = "Starter";
    } else if (level === 2) {
      levelText = "Intermediate";
    } else if (level === 3) {
      levelText = "Advanced";
    } else {
      levelText = "Standard"; 
    }
    return levelText;
}   // END levelDisplay()