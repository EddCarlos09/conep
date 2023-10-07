<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CompareFieldGreaterThan implements Rule
{

    //Otro campo a comparar
    private $anotherFieldName;
    //Valor que debe de comparar con el otro campo
    private $anotherFieldValueCompare;
    //Tipo de validacion en relación al otro campo
    private $anotherFieldtypeValidation;
    //Valor que debe de comparar el campo actual
    private $fieldValueCompare;
    //Tipo de validacion del campo actual
    private $fieldtypeValidation;
    //Mensaje de error
    private $errorMesssage;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct
    (
        $anotherFieldName,
        $anotherFieldValueCompare,
        $anotherFieldtypeValidation,
        $fieldValueCompare,
        $fieldtypeValidation,
        $errorMesssage
    )
    {
        $this->anotherFieldName = $anotherFieldName;
        $this->anotherFieldValueCompare = $anotherFieldValueCompare;
        $this->anotherFieldtypeValidation = $anotherFieldtypeValidation;
        $this->fieldValueCompare = $fieldValueCompare;
        $this->fieldtypeValidation = $fieldtypeValidation;
        $this->errorMesssage = $errorMesssage;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if(!request()->has($this->anotherFieldName))
        {
            return false;
        }

        $valueAnotherField = request()->get($this->anotherFieldName);
        $isValidAnotherField = false;

        switch ($this->anotherFieldtypeValidation) {
            case ">":
                if($valueAnotherField > $this->anotherFieldValueCompare){
                    $isValidAnotherField = true;
                }
                break;
            case ">=":
                if($valueAnotherField >= $this->anotherFieldValueCompare){
                    $isValidAnotherField = true;
                }
                break;
            case "<":
                if($valueAnotherField < $this->anotherFieldValueCompare){
                    $isValidAnotherField = true;
                }
                break;
            case "<=":
                if($valueAnotherField <= $this->anotherFieldValueCompare){
                    $isValidAnotherField = true;
                }
                break;
            case "==":
                if($valueAnotherField == $this->anotherFieldValueCompare){
                    $isValidAnotherField = true;
                }
                break;
        }
        if($isValidAnotherField == false){
            return true;
        }
        $isValidField = false;
        switch ($this->fieldtypeValidation) {
            case ">":
                if($value > $this->fieldValueCompare){
                    $isValidField = true;
                }
                break;
            case ">=":
                if($value >= $this->fieldValueCompare){
                    $isValidField = true;
                }
                break;
            case "<":
                if($value < $this->fieldValueCompare){
                    $isValidField = true;
                }
                break;
            case "<=":
                if($value <= $this->fieldValueCompare){
                    $isValidField = true;
                }
                break;
            case "==":
                if($value == $this->fieldValueCompare){
                    $isValidField = true;
                }
                break;
        }
        return $isValidField;

    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->errorMesssage;
    }
}
