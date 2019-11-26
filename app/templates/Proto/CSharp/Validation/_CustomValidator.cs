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
            RuleFor(<%= name %> => <%= name %>.<%= rule.property %>).NotEmpty();
<% }); -%>            
        }

    }

    public static partial class ValidatorExtensions
    {
        private static readonly Lazy<<%= namePascalCase %>Validator> _lazy<%= namePascalCase %>Validator
            = new Lazy<<%= namePascalCase %>Validator>(() => new <%= namePascalCase %>Validator());

        private static <%= namePascalCase %>Validator _<%= name %>ValidatorInstance { get { return _lazy<%= namePascalCase %>Validator.Value; } }

        public static string GetValidateErrorsString(this <%= namePascalCase %> objectToValidate)
            => objectToValidate.GetValidateErrorsString(_<%= name %>ValidatorInstance);

        public static void ValidateAndThrow(this <%= namePascalCase %> objectToValidate)
            => objectToValidate.ValidateAndThrow(_<%= name %>ValidatorInstance);

        public static ValidationResult GetValidateResult(this <%= namePascalCase %> objectToValidate)
            => _<%= name %>ValidatorInstance.Validate(objectToValidate);
    }
}
