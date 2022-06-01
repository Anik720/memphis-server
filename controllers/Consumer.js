const memphis = require('memphis-dev');
const natural = require('natural');
const Service = require('../models/serviceModel');
const SpellCorrector = require('spelling-corrector');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');

const Consumer = async () => {
  try {
    await memphis.connect({
      host: 'localhost',

      username: 'Karim', // (application type user)
      connectionToken: 'memphis', // you will get it on application type user creation
      dataPort: 2000,
    });
    const spellCorrector = new SpellCorrector();
    spellCorrector.loadDictionary();
    const consumer = await memphis.consumer({
      stationName: 'darun',
      consumerName: 'Kibria',
      consumerGroup: 'anik',
    });

    consumer.on('message', async (message) => {
      console.log(message.getData().toString());
      const a = message.getData().toString();
      const lexedReview = aposToLexForm(a);
      const spellCorrector = new SpellCorrector();
      spellCorrector.loadDictionary();
      const casedReview = lexedReview.toLowerCase();
      const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
      //console.log("Helloo",alphaOnlyReview)
      const { WordTokenizer } = natural;
      const tokenizer = new WordTokenizer();
      const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
      //console.log("Helloo",tokenizedReview)
      tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
      });
      const filteredReview = SW.removeStopwords(tokenizedReview);

      const { SentimentAnalyzer, PorterStemmer } = natural;
      const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

      const analysis = analyzer.getSentiment(filteredReview);
      let messagee;

      if (analysis < 0) {
        messagee = 'failed';
      } else {
        await Service.create({ post });
        messagee = 'successs';
      }
      console.log(messagee);

      res.seb;
      message.ack();
    });

    consumer.on('error', (error) => {
      console.log(error);
    });
  } catch (ex) {
    console.log(ex);
    memphis.close();
  }
};
//Consumer();
module.exports = Consumer;
