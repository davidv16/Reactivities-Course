using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;
using Microsoft.OpenApi.Models;


namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            //inject our configuration into our startup
            //runs the appsettings.json files
            _config = config;

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(_config.GetConnectionString("DefaultConnection"));
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
            //adds the controllers to the application
            services.AddControllers();

            //add swagger to the application
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            //redirect any http requests to https
            //app.UseHttpsRedirection();

            //middleware to deal with routing of requests
            app.UseRouting();

            //middleware for authentication
            app.UseAuthorization();

            //add middleware for CORS
            app.UseCors("CorsPolicy");

            //map controller endpoints into our api
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
