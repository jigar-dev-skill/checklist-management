<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'mobile_number' => 'required|string|unique:patients|regex:/^[0-9]{10,}$/',
            'city_village' => 'nullable|string|max:255',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'mobile_number.regex' => 'Mobile number must be at least 10 digits',
            'mobile_number.unique' => 'This mobile number is already registered',
        ];
    }
}
