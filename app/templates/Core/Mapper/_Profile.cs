using AutoMapper;

namespace Core.Mapper
{
    public class <%= packagePascalCase %>Profile : Profile
    {
        public <%= packagePascalCase %>AutoMapperProfile()
        {            
            AllowNullDestinationValues = false;

<% messageList.forEach(function(message){ -%>
            CreateMap< Broadcast.<%= packagePascalCase %>.<%= message.namePascal %>, Model.<%= message.namePascal %>>().ReverseMap();
<% }); -%>

        }
    }
}
