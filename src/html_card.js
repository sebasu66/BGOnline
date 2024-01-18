class Card {
    constructor(imagePath, position) {
      this.imagePath = imagePath;
      this.position = position;
  
      this.containerEl = document.createElement('div');
      this.containerEl.classList.add('card');
      this.containerEl.style.transform = `rotateX(${60 * this.position}deg) scale(0.7)`;
  
      this.imageEl = document.createElement('img');
      this.imageEl.src = this.imagePath;
      this.containerEl.appendChild(this.imageEl);
  
      this.storyEl = document.createElement('div');
      this.storyEl.classList.add('story');
      this.containerEl.appendChild(this.storyEl);
  
      // Add your story content here (e.g., city name, description)
  
      this.containerEl.addEventListener('click', () => {
        // Handle card click event (e.g., show details, activate story)
      });
    }
  
    render() {
      return this.containerEl;
    }
  }
  
  // Example usage
  const card1 = new Card('../Games/Root_ES/CARDS_DECK1/f8.png', 0);
  const card2 = new Card('../Games/Root_ES/CARDS_DECK1/f7.png', 1);
  const card3 = new Card('../Games/Root_ES/CARDS_DECK1/f6.png', 2);
  
  document.body.appendChild(card1.render());
  document.body.appendChild(card2.render());
  document.body.appendChild(card3.render());
  
  