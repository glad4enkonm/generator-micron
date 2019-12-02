using FluentValidation;
using FluentValidation.Results;
using System;
using System.Linq;

namespace Broadcast.<%= packagePascalCase %>.Validation
{
    public static partial class ValidatorExtensions
    {
        
        public static string GetValidateErrorsString<T>(this T objectToValidate, AbstractValidator<T> validator)
        {
            ValidationResult result = validator.Validate(objectToValidate);
            string message = result.Errors.Aggregate("",
                (res, err) => $"{res}Property {err.PropertyName} failed validation. Error: { err.ErrorMessage}{Environment.NewLine}"
            );
            return string.IsNullOrEmpty(message) ? null : message;
        }

        public static void ValidateAndThrow<T>(this T objectToValidate, AbstractValidator<T> validator)
        {
            ValidationResult result = validator.Validate(objectToValidate);
            string message = result.Errors.Aggregate("",
                (res, err) => $"{res}Property {err.PropertyName} failed validation. Error: { err.ErrorMessage}{Environment.NewLine}"
            );
            if (!string.IsNullOrEmpty(message))
                throw new ArgumentException(message);
        }
    }
}
