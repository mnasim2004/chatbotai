import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQHandleProps {
    onFaqHandle: (event: FAQ[]) => void;
  }

const FAQForm: React.FC<FAQHandleProps> = ({ onFaqHandle }) => {
  // Initialize state for number of FAQs and the array of FAQs
  const [numfaqs, setNumfaqs] = useState<number>(1);
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }]);

  // Handle change for question and answer inputs
  const handleInputChange = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
    onFaqHandle(newFaqs)
  };

  // Add a new FAQ pair
  const addFAQ = () => {
    setNumfaqs(numfaqs + 1);
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  // Remove a FAQ pair
  const removeFAQ = (index: number) => {
    if (numfaqs > 1) {
      setNumfaqs(numfaqs - 1);
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  return (
        <div className='flex flex-col content-center'>
      {faqs.map((faq, index) => (
        <div key={index} className='flex flex-row gap-2' style={{ marginBottom: '10px' }}>
            <div className='flex flex-col w-[95%]'>
                <input
                type="text"
                placeholder="Question"
                value={faq.question}
                className="h-10 rounded-lg rounded-bl-none rounded-br-none border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}
                onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                />
                <input
                type="text"
                placeholder="Answer"
                value={faq.answer}
                className="h-10 rounded-lg rounded-tl-none rounded-tr-none border-2 px-2" style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))", borderTop:1}}
                onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                />
            </div>
          
          <button
            type="button"
            onClick={() => removeFAQ(index)}
            className='w-[5%]'
            style={{
              backgroundColor: 'inherit',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addFAQ}
        className='w-10 h-10 self-center'
        style={{
          padding: '1px 2px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        +
      </button>
    </div>
  );
};

export default FAQForm;
