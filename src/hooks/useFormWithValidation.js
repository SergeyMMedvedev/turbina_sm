import { useState, useCallback } from 'react';

function useFormWithValidation(setCustomValidity) {
    const [values, setValues] = useState({
        name: '',
        age: '',
        email: '',
        tel: '',
        text: '',
        offer: false,
        type: 'parent'
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    function handleChange(evt) {
        const target = evt.target;
        const name = target.name;
        const value = target.value;
        const isCheckbox = target.type === 'checkbox';

        setCustomValidity(target);

        setValues({
            ...values,
            [name]: isCheckbox ? target.checked : value
        });

        setErrors({
            ...errors,
            [name]: target.validationMessage
        });


        setIsFormValid(target.closest('form').checkValidity());
    };

    const resetForm = useCallback(
        (newValues = {
            name: '',
            age: '',
            email: '',
            tel: '',
            text: '',
            offer: false,
            type: 'parent'
        }, 
        newErrors = {}, 
        newIsFormValid = false) => {
          setValues(newValues);
          setErrors(newErrors);
          setIsFormValid(newIsFormValid);
        },
        [setValues, setErrors, setIsFormValid]
      );


    return { values, handleChange, errors, isFormValid, resetForm }
}

export default useFormWithValidation;