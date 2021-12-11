using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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

                if(activity == null)
                    throw new Exception("Could not find activity");

                _context.Remove(activity);

                //send an asynchronus request with the data to the db
                //if there were more than 0 new items saved then return an int value to success variable
                var success = await _context.SaveChangesAsync() > 0;

                //if success then return 200 response to controller
                if (success) return Unit.Value;

                //if unsuccessfull then return a problem message.
                throw new System.Exception("Problem saving changes");
            }
        }
    }
}