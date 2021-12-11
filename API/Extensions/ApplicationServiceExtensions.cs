using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration config)
        {
            //adds the datacontext and creates a connection to sqlite
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            //add cors (cross origin policy) so that the frontend can call the api
            services.AddCors(opt =>
            {
                //add the policy
                /**
                * @param nickname
                * @param the policy itself.
                */
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    // alow headers and methods from the origin of .....
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            //add MediatR as a service
            services.AddMediatR(typeof(List.Handler).Assembly);

            //add auto mapper as a service
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            //add swagger to the application
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            return services;
        }
    }
}