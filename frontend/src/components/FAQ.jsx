import React, { useState } from 'react';

const FAQ = () => {
  const [openAnswer, setOpenAnswer] = useState(null);

  const toggleAnswer = (id) => {
    setOpenAnswer(openAnswer === id ? null : id);
  };

  return (
    <section className="relative mx-auto w-full py-16 px-5 font-sans text-gray-800 sm:px-20 md:max-w-screen-lg lg:py-24">
      <h2 className="mb-5 text-center font-sans text-4xl sm:text-5xl font-bold">Frequently Asked Questions</h2>
      <p className="mb-12 text-center text-lg text-gray-600">Here are some of the most common questions about Senerity and our services. If you have any other queries, feel free to reach out.</p>
      <ul className="space-y-4">
        {[1, 2, 3, 4].map((id) => (
          <li key={id} className="text-left">
            <div className="relative flex flex-col rounded-md border bg-white/20 border-gray-100 shadow-md cursor-pointer" onClick={() => toggleAnswer(id)}>
              <div className="relative ml-4 py-4 pr-12">
                <h3 className="text-sm text-gray-600 lg:text-base">How do I chat with the AI doctor?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`absolute right-0 top-4 ml-auto mr-5 h-4 text-gray-500 transition-transform ${openAnswer === id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`max-h-0 overflow-hidden transition-all duration-500 ${openAnswer === id ? 'max-h-96' : ''}`}>
                <div className="p-5">
                  <p className="text-sm">To start a coversation with the AI Serenity, simply click on 'Chat with Serenity' section, choose your preferred doctor, select a time slot, and confirm your appointment.</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col justify-center items-center">
        <a className="inline-flex rounded-lg py-3 px-5 text-2xl text-gray-600" href="#">Still have questions?</a>
        <a className="inline-flex cursor-pointer rounded-lg bg-[#101827] py-3 px-9 my-3 text-lg text-white" href="#">Contact us</a>
      </div>
    </section>
  );
};

export default FAQ;