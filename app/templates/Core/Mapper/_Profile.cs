using AutoMapper;
using Broadcast = Broadcast.<%= packagePascalCase %>;

namespace Core.Mapper
{
    public class <%= packagePascalCase %>Profile : Profile
    {
        public <%= packagePascalCase %>AutoMapperProfile()
        {            
            AllowNullDestinationValues = false;

<% messageList.forEach(function(message){ -%>
            CreateMap<Broadcast.<%= message.namePascal %>, Model.<%= message.namePascal %>>().ReverseMap();
<% }); -%>

        }
    }
}
