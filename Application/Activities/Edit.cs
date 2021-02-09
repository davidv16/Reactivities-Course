using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
             public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
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

                var activity = await _context.Activities.FindAsync(request.Id);

                //if there is no activity and nothing to be sent
                if(activity == null)
                    //throw an exception to stop it from being sent to the db
                    throw new Exception("Could not find activity");
                
                                //if this is null then everything after ?? will be executed
                activity.Title = request.Title ?? activity.Title;
                activity.Description = request.Description ?? activity.Description;
                activity.Category = request.Category ?? activity.Category;
                activity.Date = request.Date ?? activity.Date;
                activity.City = request.City ?? activity.City;
                activity.Venue = request.Venue ?? activity.Venue;

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
