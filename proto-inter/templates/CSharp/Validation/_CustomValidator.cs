using System;
using FluentValidation;
using FluentValidation.Results;

namespace Broadcast.<%= packagePascalCase %>.Validation
{
    public class <%= namePascalCase %>Validator : AbstractValidator<<%= namePascalCase %>>
    {
        public <%= namePascalCase %>Validator()
        {
            // Fill validation rules here
<% ruleList.forEach(function(rule){ -%>
            RuleFor(<%= nameCamelCase %> => <%= nameCamelCase %>.<%= rule.property %>).NotEmpty();
<% }); -%>            
        }

    }

    public static partial class ValidatorExtensions
    {
        private static readonly Lazy<<%= namePascalCase %>Validator> _lazy<%= namePascalCase %>Validator
            = new Lazy<<%= namePascalCase %>Validator>(() => new <%= namePascalCase %>Validator());

        private static <%= namePascalCase %>Validator _<%= nameCamelCase %>ValidatorInstance { get { return _lazy<%= namePascalCase %>Validator.Value; } }

        public static string GetValidateErrorsString(this <%= namePascalCase %> objectToValidate)
            => objectToValidate.GetValidateErrorsString(_<%= nameCamelCase %>ValidatorInstance);

        public static void ValidateAndThrow(this <%= namePascalCase %> objectToValidate)
            => objectToValidate.ValidateAndThrow(_<%= nameCamelCase %>ValidatorInstance);

        public static ValidationResult GetValidateResult(this <%= namePascalCase %> objectToValidate)
            => _<%= nameCamelCase %>ValidatorInstance.Validate(objectToValidate);
    }
}
