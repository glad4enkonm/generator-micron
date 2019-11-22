using System;
using System.Linq;
using Broadcast.<%= packagePascalCase %>;
using Broadcast.<%= packagePascalCase %>.Validation;
using FluentValidation;
using FluentValidation.Results;

namespace Broadcast.<%= packagePascalCase %>.Validation
{
    public class <%= namePascalCase %>Validator : AbstractValidator<<%= namePascalCase %>>
    {
        public <%= namePascalCase %>Validator()
        {
            // Fill validation rules here


            /*
            RuleFor(group => group.Name).NotNull().NotEmpty().Matches("[A-Za-z][a-z0-9_]+");
            RuleFor(group => group.UserList).NotEmpty();
            RuleForEach(group => group.UserList).ChildRules(simleUser => {
                simleUser.RuleFor(x => x.DaimlerId).NotNull().NotEmpty().Matches("[A-Za-z][a-z0-9_]+");
            });
             */
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
