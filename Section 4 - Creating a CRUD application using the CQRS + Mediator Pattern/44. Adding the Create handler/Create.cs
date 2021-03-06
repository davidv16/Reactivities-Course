using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<Unit> Handle(Command request, 
                CancellationToken cancellationToken)
            {
                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City,
                    Venue = request.Venue

                };
                
                //add the activity variable with the new data items to the datacontext for it to be sent to the db
                _context.Activities.Add(activity);

                //send an asynchronus request with the data to the db
                //if there were more than 0 new items saved then return an int value to success variable
                var success = await _context.SaveChangesAsync() > 0;

                //if success then return 200 response to controller
                if(success) return Unit.Value;

                //if unsuccessfull then return a problem message.
                throw new System.Exception("Problem saving changes");
            }
        }
    }
}