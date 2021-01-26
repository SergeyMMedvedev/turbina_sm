import React from 'react';
import './Form.css';
import cn from 'classnames';
import useFormWithValidation from '../hooks/useFormWithValidation.js';
import setCustomValidity from '../utils/setCustomValidity.js';
import { api } from '../utils/Api.js';
import TextContainer from './TextContainer.js';



function Form() {

    const { values, handleChange, errors, isFormValid, resetForm } = useFormWithValidation(setCustomValidity);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isErrorVisible, setIsErrorVisible] = React.useState(false);
    const [isMusician, setIsMusician] = React.useState(false);

    const inputNameStyle = cn('form__input', 'form__input_name', {'form__input_invalid': errors.name});
    const inputAgeStyle = cn('form__input', 'form__input_age', {'form__input_invalid': errors.age});
    const inputTelStyle = cn('form__input', 'form__input_tel', {'form__input_invalid': errors.tel});
    const inputEmailStyle = cn('form__input', 'form__input_email', {'form__input_invalid': errors.email});
    const inputTextStyle = cn('form__textarea', 'form__input', {'form__input_invalid': errors.text});

    function handleSubmit(evt) {
        evt.preventDefault();
        setIsSubmitted(true);

        api.submitForm(values)
           .then(() => {
              setIsSuccess(true);
              setIsSubmitted(false);
              setIsErrorVisible(false);
              setIsMusician(false);
              resetForm();

              setTimeout(() => 
                setIsSuccess(false),
                5000
              );
           })
           .catch((err) => {
               console.log(err);
               setIsSubmitted(false);
               setIsErrorVisible(true);
           })
    }

    function handleIsMusicianClick() {
      setIsMusician(true);
    }

    function handleIsParentClick() {
      setIsMusician(false);
    }

    return(
        <div className="form-container" id="form-participate">

          <TextContainer>
            <h2 className="text-container__heading">Форма</h2>
            <p className="text-container__paragraph">Заполните эту форму и вы можете стать частью проекта.</p>
          </TextContainer>

        <form className="form" name="send-poem" onSubmit={handleSubmit} noValidate>
           
           <div className="form__type-buttons">
             <label htmlFor="parent" className="form__input_type-label">
               <input type="radio" name="type" id="parent" className="form__input_type-choice" value="parent" onClick={handleIsParentClick} onChange={handleChange} checked={!isMusician} />
               <span className="form__choice-pseudo-item">Я родитель</span>
             </label>

             <label htmlFor="musician" className="form__input_type-label">
              <input type="radio" name="type" id="musician" className="form__input_type-choice" value="musician" onClick={handleIsMusicianClick} onChange={handleChange} checked={isMusician} />
              <span className="form__choice-pseudo-item">Я музыкант</span>
             </label>
           </div>

                <input 
                  className={inputNameStyle}
                  name="name" 
                  placeholder={(!isMusician && 'Имя и фамилия автора') || (isMusician && 'Представьтесь, пожалуйста')}
                  required 
                  minLength="2" 
                  maxLength="50" 
                  pattern="^[A-Za-zА-Яа-яёЁ\s\-]+$"
                  value={values.name || ''}
                  onChange={handleChange}
                />
                {errors.name && <span className="form__input-error">{errors.name}</span>}

                {!isMusician && <input 
                  className={inputAgeStyle}
                  type="number"
                  name="age" 
                  placeholder="Возраст автора"
                  required
                  min="1"
                  max="99"
                  value={values.age || ''}
                  onChange={handleChange}
                />}
                {!isMusician && errors.age && <span className="form__input-error">{errors.age}</span>}

                <input 
                  className={inputTelStyle}
                  type="tel" 
                  name="tel" 
                  placeholder="Телефон" 
                  required
                  minLength="10"
                  maxLength="20"
                  pattern="^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$"
                  value={values.tel || ''}
                  onChange={handleChange}
                />
               {errors.tel && <span className="form__input-error">{errors.tel}</span>}

                <input 
                  className={inputEmailStyle}
                  type="email" 
                  name="email" 
                  placeholder="Почта" 
                  required 
                  minLength="6" 
                  maxLength="50" 
                  pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
                  value={values.email || ''}
                  onChange={handleChange}
                />
                {errors.email && <span className="form__input-error">{errors.email}</span>}


                <textarea 
                  className={inputTextStyle}
                  name="text"
                  placeholder={(!isMusician && 'Стихи') || (isMusician && 'Ссылка на вашу музыку')}
                  required
                  value={values.text || ''}
                  onChange={handleChange}
                >
                </textarea>
                {errors.text && <span className="form__input-error">{errors.text}</span>}

      
                <label htmlFor="offer" className="form__input-label">
                  <input 
                    className="form__input_radio" 
                    type="checkbox" 
                    name="offer" 
                    value="agree" 
                    id="offer"
                    required 
                    checked={values.offer}
                    onChange={handleChange}
                  />
                  <span className="form__pseudo-item"></span>

                  {/* <span className="form__label-text">Согласен с <a className="form__offer-link" target="_blank" href="#" rel="noreferrer">офертой</a></span> */}
                  <span className="form__label-text">
                    {
                      isMusician
                        ? 'Да-да, я понимаю, что соглашаюсь написать музыку на детские стихи'
                        : 'Я разрешаю передавать стихи музыкантам и создавать музыку на них'
                    }
                  </span>
                </label>
                  
                {errors.offer && <span className="form__input-error">{errors.offer}</span>}


                <button type="submit" className="form__submit-button" disabled={!isFormValid}>
                  <span className="form__button-text">
                    {isSubmitted ? 'Отправляем...' : isSuccess ? 'Ура, форма отправлена!' : 'Отправить форму'}
                  </span>
                </button>
                {isErrorVisible && <span className="form__wrong-submit">Упс, что-то пошло не так и форма не отправилась, попробуйте ещё раз!</span>}
                {!isFormValid && <span className="form__fill-hint">Чтобы отправить форму, пожалуйста, заполните все поля</span>}

                
            </form>
      </div>
    )
}

export default Form;
